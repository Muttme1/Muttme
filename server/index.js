
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get('/api/health', (_, res) => res.json({ ok: true }));
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (_, res) => res.sendFile(path.join(clientDist, 'index.html')));
app.listen(PORT, () => console.log(`MuttMe server running on port ${PORT}`));
