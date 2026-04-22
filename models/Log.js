const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    lighthouse: { type: String, required: true },
    visibilityNM: { type: Number, required: true },
    windSpeedKnots: Number,
    windDirection: String,
    temperatureF: Number,
    seaState: String,
    fog: { type: Boolean, default: false },
    equipmentStatus: {
      light: { type: String, enum: ['OK', 'Dim', 'Out'], default: 'OK' },
      horn: { type: String, enum: ['OK', 'Weak', 'Out'], default: 'OK' },
    },
    keeper: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
