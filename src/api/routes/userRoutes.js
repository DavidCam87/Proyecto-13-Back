const { updateUser, deleteUser } = require("../controllers/userController.js");

const userRouter = require("express").Router();

userRouter.put("/users/:id", updateUser); //*OK
userRouter.delete("/users/:id", deleteUser); //*OK

module.exports = userRouter;