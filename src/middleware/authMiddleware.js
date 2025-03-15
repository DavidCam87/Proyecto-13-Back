const jwt = require("jsonwebtoken");
const User = require("../api/models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // Excluir password

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado. Acceso denegado." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
  next();
};

module.exports = { authenticate, isAdmin };
