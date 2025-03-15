const Service = require("../models/Service.js");

const getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los servicios" });
  }
};

module.exports = { getServices };