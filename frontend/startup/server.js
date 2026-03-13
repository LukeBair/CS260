const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

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

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
