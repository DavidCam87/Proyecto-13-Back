const { getMecanics } = require("../controllers/mecanicController.js");

const mecanicRouter = require("express").Router();

mecanicRouter.get("/", getMecanics); //*OK

module.exports = mecanicRouter;