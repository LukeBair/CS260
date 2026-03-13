const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { createUser, createToken, verifyPassword, removeToken, getWorldData, saveWorldData, getUserByToken, updateAccount } = require('./storage');
const { GoogleGenAI } = require('@google/genai');
const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve frontend static files in production
app.use(express.static('public'));

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI(process.env.GEMINI_API_KEY) : null;

// --- Auth endpoints ---

// register and login
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

app.delete('/api/auth/logout', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    removeToken(token);
    res.clearCookie('token');
  }
  res.json({ message: 'Logged out' });
});

// --- World data endpoints ---

app.get('/api/world', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  res.json(getWorldData(username));
});

app.put('/api/world', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  const success = saveWorldData(username, req.body);
  if (!success) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

// --- Account endpoint ---

app.put('/api/account', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const username = getUserByToken(token);
  if (!username) return res.status(401).json({ error: 'Invalid token' });

  const success = updateAccount(username, req.body);
  if (!success) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

// --- Gemini search endpoint ---

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
