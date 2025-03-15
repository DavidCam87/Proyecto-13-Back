const Appointment = require("../models/appointment.js");
const User = require("../models/user.js");
const Mecanic = require("../models/mecanic.js");
const Service = require("../models/Service.js");

const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate("user service mecanic");
    console.log("Citas obtenidas de la BD:", appointments);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las citas", error: error.message, status: error.status });
  }
};

const updateAppointment = async (req, res, next) => {
  const { id } = req.params;
  const { date, startTime, user, service, mecanic } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { date, startTime, user, service, mecanic },
      { new: true }
    );
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la cita" });
  }
};

const deleteAppointmentAdmin = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: "Cita eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la cita" });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("appointments");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error: error.message, status: error.status });
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role, password, telephone, appointments } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { name, email, role, password, telephone, appointments }, { new: true });
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

const createMecanic = async (req, res, next) => {
  const { name } = req.body;
  try {
    const mecanic = new Mecanic({ name });
    await mecanic.save();
    res.status(201).json(mecanic);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el mecánico" });
  }
};

const updateMecanic = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const mecanic = await Mecanic.findByIdAndUpdate(id, { name }, { new: true });
    res.status(200).json(mecanic);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el mecánico" });
  }
};

const deleteMecanic = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Mecanic.findByIdAndDelete(id);
    res.status(200).json({ message: "Mecánico eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el mecánico" });
  }
};

const createService = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const service = new Service({ name, description });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el servicio" });
  }
};

const updateService = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const service = await Service.findByIdAndUpdate(id, { name, description }, { new: true });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el servicio" });
  }
};

const deleteService = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: "Servicio eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el servicio" });
  }
};

module.exports = {
  getAllAppointments,
  updateAppointment,
  deleteAppointmentAdmin,
  getAllUsers,
  updateUser,
  deleteUser,
  createMecanic,
  updateMecanic,
  deleteMecanic,
  createService,
  updateService,
  deleteService,
};