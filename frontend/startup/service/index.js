const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { createUser, createToken, verifyPassword, removeToken, getWorldData, saveWorldData, getUserByToken, updateAccount, getCollaborators, getConnectedUsers, addCollaborator, removeCollaborator, addEditLog, getEditLog } = require('./database');
const { GoogleGenAI } = require('@google/genai');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve frontend static files in production
app.use(express.static('public'));

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI(process.env.GEMINI_API_KEY) : null;

const server = createServer(app);
const wss = new WebSocketServer({ server });

const userConnections = new Map();

function broadcastToUser(username, message) {
  const connections = userConnections.get(username);
  if (connections) {
    const messageJSON = JSON.stringify(message);
    connections.forEach(ws => {
      // if websocket is ready
      if (ws.readyState === 1) {
        ws.send(messageJSON);
      }
    });
  }
}

function broadcastPresence(username) {
  getConnectedUsers(username).then(collaborators => {
    const online = collaborators.filter(u => userConnections.has(u));
    // send each collaborator the list of who's online among their group
    for (const collab of collaborators) {
      const theirOnline = collaborators.filter(u => u !== collab && userConnections.has(u));
      if (userConnections.has(username) && username !== collab) theirOnline.push(username);
      broadcastToUser(collab, { type: 'presence', users: [...new Set(theirOnline)] });
    }
    // also send to the user themselves
    broadcastToUser(username, { type: 'presence', users: online.filter(u => u !== username) });
  });
}

wss.on('connection', (ws) => {
  let user = null;

  ws.on('message',(message) => {
    try {
      const msg = JSON.parse(message);
      if (msg.type === 'identify' && msg.username) {
        user = msg.username;
        if(!userConnections.has(user)) {
          userConnections.set(user, new Set());
        }
        userConnections.get(user).add(ws);
        broadcastPresence(user);
      }
    } catch (err) { /* who really cares */ }
  });

  ws.on('close', () => {
    if (user && userConnections.has(user)) {
      userConnections.get(user).delete(ws);
      if (userConnections.get(user).size === 0) {
        userConnections.delete(user);
      }
      broadcastPresence(user);
    }
  });

  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});

// loop to detect and close dead connections
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// --- Auth endpoints ---

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const success = await createUser(username, password);
  if (!success) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const token = createToken(username);
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
  res.json({ username });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const valid = await verifyPassword(username, password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = createToken(username);
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
  res.json({ username });
});

app.delete('/api/auth/logout', async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    await removeToken(token);
    res.clearCookie('token');
  }
  res.json({ message: 'Logged out' });
});

// --- World data endpoints ---

app.get('/api/world', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = await getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });
  res.json(await getWorldData(username));
});

app.put('/api/world', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = await getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  const editAction = req.body._editAction;
  const worldData = { ...req.body };
  delete worldData._editAction;

  const success = await saveWorldData(username, worldData);
  if (!success) return res.status(404).json({ error: 'User not found' });

  const users = await getConnectedUsers(username);
  // Also save to all connected users so they share the same world
  for (const collab of users) {
    await saveWorldData(collab, worldData);
  }

  // Log the edit for the user and their collaborators
  if (editAction) {
    // await addEditLog(username, editAction);
    const edit = { username, action: editAction, timestamp: new Date().toISOString() };
    const connectedUsers = await getConnectedUsers(username);
    for (const collaber of connectedUsers) {
      broadcastToUser(collaber, { type: 'editNotification', edit: edit });
      broadcastToUser(collaber, { type: 'worldUpdate' });
    }
  }

  res.json({ success: true });
});

// --- Account endpoint ---

app.put('/api/account', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = await getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  const success = await updateAccount(username, req.body);
  if (!success) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

// --- Collaborator endpoints ---

app.get('/api/collaborators', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = await getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  res.json({ collaborators: await getCollaborators(username) });
});

app.post('/api/collaborators', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = await getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  const { collaborator } = req.body;
  if (!collaborator) return res.status(400).json({ error: 'Collaborator username required' });
  if (collaborator === username) return res.status(400).json({ error: 'Cannot add yourself' });

  const success = await addCollaborator(username, collaborator);
  if (!success) return res.status(404).json({ error: 'User not found or already added' });

  await addEditLog(username, `Added ${collaborator} as collaborator`);
  res.json({ collaborators: await getCollaborators(username) });
});

app.delete('/api/collaborators/:collaborator', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = await getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  await removeCollaborator(username, req.params.collaborator);
  res.json({ collaborators: await getCollaborators(username) });
});

// --- Edit log endpoint ---

app.get('/api/edits', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = await getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  res.json({ edits: await getEditLog(username) });
});

// --- Gemini search endpoint ---

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: query,
    });
    res.json({ text: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gemini request failed' });
  }
});

// SPA fallback
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
