const Mecanic = require("../models/mecanic");

const getMecanics = async (req, res, next) => {
  try {
    const mecanics = await Mecanic.find();
    res.status(200).json(mecanics);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los mecánicos" });
  }
};

module.exports = { getMecanics };