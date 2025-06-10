const User = require("../models/user");


const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role, password, telephone, appointments } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { name, email, role, password, appointments }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};


const deleteUser = async (req, res, next) => {
  try {
    const userDeleted = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Usuario eliminado con éxito", userDeleted });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

module.exports = {
  updateUser,
  deleteUser
};