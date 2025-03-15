const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, {
  timestamps: true,
  collection: "Service"
});


const Service = mongoose.model("Service", serviceSchema, "Service");
module.exports = Service;