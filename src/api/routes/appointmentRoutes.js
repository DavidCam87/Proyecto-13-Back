const { createAppointment, getFilteredAppointments, updateAppointmentById, getAppointmentsByDate, deleteAppointment } = require("../controllers/appointmentController.js");

const appointmentRouter = require("express").Router();

appointmentRouter.post("/newappointment", createAppointment); //*OK
appointmentRouter.get("/:date", getAppointmentsByDate); //*OK formato fecha 2025-03-05
appointmentRouter.delete("/:id", deleteAppointment); //*OK
appointmentRouter.get("/", getFilteredAppointments);
appointmentRouter.put("/:id", updateAppointmentById);


module.exports = appointmentRouter;