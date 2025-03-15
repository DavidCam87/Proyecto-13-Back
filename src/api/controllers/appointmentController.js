const Appointment = require("../models/appointment");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

const createAppointment = [
  // Validaciones
  body("date").notEmpty().withMessage("La fecha es obligatoria"),
  body("startTime").notEmpty().withMessage("La hora de inicio es obligatoria"),
  body("user").notEmpty().withMessage("El usuario es obligatorio"),
  body("service").notEmpty().withMessage("El servicio es obligatorio"),
  body("mecanic").notEmpty().withMessage("El mecánico es obligatorio"),
  // Lógica del controlador
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, startTime, user, service, mecanic } = req.body;
    try {
      const appointment = new Appointment({ date, startTime, user, service, mecanic });
      await appointment.save();
      await User.findByIdAndUpdate(user, { $push: { appointments: appointment._id } });
      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la cita", error: error.message });
    }
  },
];

const getAppointmentsByDate = async (req, res, next) => {
  const { date } = req.params;
  try {
    const appointments = await Appointment.find({ date }).populate("user service mecanic");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las citas" });
  }
};

const getFilteredAppointments = async (req, res) => {
  const { date, user, service } = req.query;
  const filter = {};

  if (date) filter.date = date; // Filtro por fecha
  if (user) filter.user = user; // Filtro por usuario
  if (service) filter.service = service; // Filtro por servicio

  try {
    const appointments = await Appointment.find(filter)
      .populate({
        path: "user",
        select: "-password"
      })
      .populate("service")
      .populate("mecanic");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las citas", error: error.message });
  }
};

const deleteAppointment = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: "Cita eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la cita" });
  }
};

const updateAppointmentById = async (req, res, next) => {
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

module.exports = { createAppointment, getFilteredAppointments, updateAppointmentById, getAppointmentsByDate, deleteAppointment };