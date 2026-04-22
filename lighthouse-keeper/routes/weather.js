const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

router.get('/patterns/:lighthouse', async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const logs = await Log.find({
      lighthouse: req.params.lighthouse,
      createdAt: { $gte: sevenDaysAgo },
    });

    if (logs.length === 0) return res.json({ message: 'No data' });

    const avgVisibility =
      logs.reduce((sum, log) => sum + log.visibilityNM, 0) / logs.length;
    const fogHours = logs.filter((log) => log.fog).length;

    res.json({
      averageVisibilityNM: Math.round(avgVisibility * 10) / 10,
      fogPercentage: Math.round((fogHours / logs.length) * 100),
      trend:
        logs[0].visibilityNM > logs[logs.length - 1].visibilityNM
          ? 'improving'
          : 'declining',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
