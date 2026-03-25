const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { createUser, createToken, verifyPassword, removeToken, getWorldData, saveWorldData, getUserByToken, updateAccount, getCollaborators, getConnectedUsers, addCollaborator, removeCollaborator, addEditLog, getEditLog } = require('./database');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve frontend static files in production
app.use(express.static('public'));

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI(process.env.GEMINI_API_KEY) : null;

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

  // Also save to all connected users so they share the same world
  for (const collab of await getConnectedUsers(username)) {
    await saveWorldData(collab, worldData);
  }

  // Log the edit for the user and their collaborators
  if (editAction) {
    await addEditLog(username, editAction);
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
      model: 'gemini-2.5-flash',
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
app.listen(port, () => console.log(`Server running on port ${port}`));
