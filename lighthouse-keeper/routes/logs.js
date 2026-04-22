const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json({
      success: true,
      id: log._id,
      message: 'Log saved',
      status: log.visibilityNM > 10 ? 'Excellent' : 'Poor',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:lighthouse', async (req, res) => {
  try {
    const logs = await Log.find({ lighthouse: req.params.lighthouse })
      .sort({ createdAt: -1 })
      .limit(24);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
