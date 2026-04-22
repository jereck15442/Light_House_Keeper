const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

router.get('/active', async (req, res) => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const alerts = await Log.find({
      createdAt: { $gte: twoHoursAgo },
      $or: [{ visibilityNM: { $lt: 3 } }, { 'equipmentStatus.light': 'Out' }],
    }).sort({ createdAt: -1 });

    res.json({
      criticalCount: alerts.length,
      alerts: alerts.map((log) => ({
        lighthouse: log.lighthouse,
        visibility: log.visibilityNM,
        status: log.fog ? 'Fog' : 'Light Failure',
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/safe-passage', async (req, res) => {
  try {
    const { lighthouse } = req.body;
    const latest = await Log.findOne({ lighthouse }).sort({ createdAt: -1 });

    if (!latest) return res.json({ safeToPass: false, message: 'No data' });

    const safe =
      latest.visibilityNM > 5 && latest.equipmentStatus.light === 'OK';
    res.json({ safeToPass: safe, visibility: latest.visibilityNM });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
