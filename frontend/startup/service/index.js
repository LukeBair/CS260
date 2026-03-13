const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve frontend static files in production
app.use(express.static('public'));

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// --- Auth endpoints ---

app.post('/api/auth/register', async (req, res) => {
  res.json({ username: req.body.username });
});

app.post('/api/auth/login', async (req, res) => {
  res.json({ username: req.body.username });
});

app.delete('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// --- World data endpoints ---

app.get('/api/world', (req, res) => {
  res.json({});
});

app.put('/api/world', (req, res) => {
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
