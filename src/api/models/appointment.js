const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  mecanic: { type: mongoose.Schema.Types.ObjectId, ref: "mecanic", required: true },
}, {
  timestamps: true,
  collection: "appointment"
});

const Appointment = mongoose.model("appointment", appointmentSchema, "appointment");
module.exports = Appointment;