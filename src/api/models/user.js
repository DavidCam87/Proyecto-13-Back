const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "appointment" }],

}, {
  timestamps: true,
  collection: "user"
}
);

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

const User = mongoose.model("user", userSchema, "user");
module.exports = User;