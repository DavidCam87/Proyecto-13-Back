const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const authRouter = require("./src/api/routes/authRoutes.js");
const appointmentRouter = require("./src/api/routes/appointmentRoutes.js");
const mecanicRouter = require("./src/api/routes/mecanicRoutes.js");
const serviceRouter = require("./src/api/routes/serviceRoutes.js");
const adminRouter = require("./src/api/routes/adminRoutes.js");
const { authenticate, isAdmin } = require("./src/middleware/authMiddleware.js");

const app = express();
const PORT = 3000;
connectDB();
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use("/api/v1/user", authRouter);   //*rurtas correctas
app.use("/api/v1/service", serviceRouter);

// Rutas protegidas
app.use("/api/v1/appointment", authenticate, appointmentRouter);
app.use("/api/v1/mecanic", authenticate, mecanicRouter);

// Rutas de administrador
app.use("/api/v1/admin", authenticate, isAdmin, adminRouter);

app.use("*", (req, res, next) => {
  return res.status(404).json("Rute not foud 🤬🤬😭🤬🤬")
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT} 👌🏼🆗😃🆗👌🏼`);
});