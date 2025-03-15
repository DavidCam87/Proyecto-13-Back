const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const register = [
  // Validaciones
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El email no es válido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("Datos recibidos:", req.body);

    try {
      const userDuplicated = await User.findOne({
        $or: [{ name: req.body.name }, { email: req.body.email }]
      });
      if (userDuplicated) {
        return res.status(420).json({ message: "Nombre de usuario ya existente ❌" });
      }

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: "user"
      });

      const user = await newUser.save();
      return res.status(201).json(user);
    } catch (error) {
      console.error("Error en el registro:", error);
      res.status(500).json({ message: "Error en el servidor", error: error.message, status: error.status, stack: error.stack });
    }
  }];

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(420).json({ message: "Nombre de usuario o contraseña incorrecto❌" });
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(420).json({ message: "Nombre de usuario o contraseña incorrecto❌" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { register, login };