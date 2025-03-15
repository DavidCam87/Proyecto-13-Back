const mongoose = require('mongoose');

const mecanicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

}, {
  timestamps: true,
  collection: "mecanic"
});

const Mecanic = mongoose.model("mecanic", mecanicSchema, "mecanic");
module.exports = Mecanic;