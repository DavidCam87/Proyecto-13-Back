const { getServices } = require("../controllers/serviceController.js");

const serviceRouter = require("express").Router();

serviceRouter.get("/", getServices); //*OK

module.exports = serviceRouter;