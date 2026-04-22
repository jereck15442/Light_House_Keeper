const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let logs = [];

app.post('/api/logs', (req, res) => {
  const log = {
    id: Date.now(),
    lighthouse: req.body.lighthouse,
    visibilityNM: parseFloat(req.body.visibilityNM),
    fog: req.body.fog || false,
    keeper: req.body.keeper || 'Anonymous',
    time: new Date().toLocaleString(),
  };
  logs.unshift(log);
  res.json({ success: true, id: log.id });
});

app.get('/api/logs/:lighthouse', (req, res) => {
  const lighthouseLogs = logs.filter(
    (l) => l.lighthouse === req.params.lighthouse
  );
  res.json(lighthouseLogs.slice(0, 24));
});

app.get('/api/alerts/active', (req, res) => {
  const alerts = logs.filter((l) => l.visibilityNM < 3);
  res.json({ critical: alerts.length, alerts });
});

app.get('/api/health', (req, res) => res.json({ status: '🗼 LIVE' }));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(5000, () => {
  console.log('🗼 http://localhost:5000');
});
