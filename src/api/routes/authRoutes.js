const { register, login } = require("../controllers/authController");

const authRouter = require("express").Router();

authRouter.post("/register", register); //*OK
authRouter.post("/login", login); //*OK

module.exports = authRouter;