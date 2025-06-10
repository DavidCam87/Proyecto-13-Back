const { getAllAppointments, updateAppointment, deleteAppointmentAdmin, getAllUsers, updateUser, deleteUser, createMecanic, updateMecanic, deleteMecanic, createService, updateService, deleteService } = require("../controllers/adminControllers/adminController.js");
const { importDataFromExcel, exportDataToExcel } = require("../controllers/adminControllers/exportImportController.js");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const adminRouter = require("express").Router();

adminRouter.get("/appointments", getAllAppointments); //*OK
adminRouter.put("/appointments/:id", updateAppointment); //*OK
adminRouter.delete("/appointments/:id", deleteAppointmentAdmin); //*OK

adminRouter.get("/users", getAllUsers);//*OK
adminRouter.put("/users/:id", updateUser); //*OK
adminRouter.delete("/users/:id", deleteUser); //*OK

adminRouter.post("/mecanics", createMecanic); //*OK
adminRouter.put("/mecanics/:id", updateMecanic); //*OK
adminRouter.delete("/mecanics/:id", deleteMecanic); //*OK

adminRouter.post("/services", createService); //*OK
adminRouter.put("/services/:id", updateService); //*OK
adminRouter.delete("/services/:id", deleteService); //*OK

// Nuevas rutas para importar y exportar desde Excel
adminRouter.post("/import-excel/:model", upload.single('file'), importDataFromExcel);
adminRouter.get("/export-excel/:model", exportDataToExcel);

module.exports = adminRouter;