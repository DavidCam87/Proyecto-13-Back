const Appointment = require("../../models/appointment.js");
const User = require("../../models/User.js");
const Mecanic = require("../../models/mecanic.js");
const Service = require("../../models/Service.js");
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const fs = require('fs').promises; // Importamos el módulo de filesystem para operaciones asíncronas
const path = require('path');


const importDataFromExcel = async (req, res) => {
  let filePath
  try {
    const { model } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'Por favor, sube un archivo Excel.' });
    }

    const importDir = path.join(__dirname, '../../imports');
    await fs.mkdir(importDir, { recursive: true }); // Se crea la carpeta "imports" si no existe
    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const fileName = `${timestamp}-${originalName}`;
    filePath = path.join(importDir, fileName);

    await fs.writeFile(filePath, req.file.buffer); // Guardamos el archivo en la carpeta "imports"

    const workbook = xlsx.readFile(filePath, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: null });

    let Model;
    switch (model.toLowerCase()) {
      case 'user':
        Model = User;
        break;
      case 'service':
        Model = Service;
        break;
      case 'mecanic':
        Model = Mecanic;
        break;
      case 'appointment':
        Model = Appointment;
        break;
      default:
        await fs.unlink(filePath); // Se elimina el archivo si el modelo no es válido
        return res.status(400).json({ message: 'Modelo no válido.' });
    }

    let createdCount = 0;
    let updatedCount = 0;
    const errors = []; // Para guardar información sobre errores

    // Para procesar cada fila del JSON obtenido del Excel
    for (const item of jsonData) {
      try {
        // Se eliminan las propiedades con valor null o undefined para evitar sobreescribir campos existentes con nada
        const cleanItem = Object.entries(item).reduce((acc, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {});

        const recordId = cleanItem.id || cleanItem._id; // Buscamos un campo 'id' o '_id' en la fila del Excel

        // Se preparan los datos para la base de datos (especialmente hashear contraseña si es usuario)
        const dataPayload = { ...cleanItem };
        delete dataPayload.id;
        delete dataPayload._id; // Eliminar '_id' también por si acaso

        // Hasheamos la contraseña para el modelo User si se proporciona una nueva
        if (model.toLowerCase() === 'user' && dataPayload.password) {
          if (!dataPayload.password.startsWith('$2b$') && !dataPayload.password.startsWith('$2a$')) {
            const saltRounds = 10;
            dataPayload.password = await bcrypt.hash(dataPayload.password, saltRounds);
          }
        }

        if (recordId) {
          //Si lo hay, se encontra y actualiza el documento por su ID
          const updatedRecord = await Model.findByIdAndUpdate(
            recordId,
            { $set: dataPayload }, // Utilizamos $set para actualizar solo los campos proporcionados
            { new: true, runValidators: true } // Opciones para devolver doc actualizado, ejecutar validaciones
          );

          if (updatedRecord) {
            updatedCount++;
          } else {
            console.warn(`Registro con ID ${recordId} no encontrado en ${model} para actualizar. No se creó.`);
            errors.push({ item: cleanItem, error: `ID ${recordId} no encontrado para actualizar.` });
          }
        } else {
          // al no haber id, se crea un nuevo documento
          await Model.create(dataPayload);
          createdCount++;
        }

      } catch (error) {
        console.error(`Error procesando fila en ${model}: ${JSON.stringify(item)}`, error);
        errors.push({ item, error: error.message });
      }
    }

    // Mensaje de respuesta
    let message = `Importación para ${model} completada. `;
    message += `Registros creados: ${createdCount}. `;
    message += `Registros actualizados: ${updatedCount}. `;
    if (errors.length > 0) {
      message += `Errores encontrados: ${errors.length}. Revisa la consola o la respuesta para más detalles.`;
      console.error("Errores durante la importación:", errors);
    }
    message += ` El archivo procesado fue: ${fileName}`;


    res.status(200).json({
      message,
      created: createdCount,
      updated: updatedCount,
      errors: errors
    });

  } catch (error) {
    console.error('Error general durante la importación de Excel:', error);
    // eliminamos el archivo subido si ocurre un error general
    if (req.file && filePath) {
      try {
        await fs.unlink(filePath);
        console.log(`Archivo temporal ${filePath} eliminado debido a error.`);
      } catch (unlinkError) {
        console.error(`Error al intentar eliminar archivo temporal ${filePath}:`, unlinkError);
      }
    }
    res.status(500).json({ message: 'Error al importar datos desde Excel.', error: error.message });
  }
};

const exportDataToExcel = async (req, res) => {
  try {
    const { model } = req.params;
    let Model;
    let fileName = `${model.toLowerCase()}s.xlsx`;
    let populateOptions = [];

    switch (model.toLowerCase()) {
      case 'user':
        Model = User;
        populateOptions = ['appointments'];
        break;
      case 'service':
        Model = Service;
        break;
      case 'mecanic':
        Model = Mecanic;
        break;
      case 'appointment':
        Model = Appointment;
        populateOptions = ['user', 'service', 'mecanic'];
        break;
      default:
        return res.status(400).json({ message: 'Modelo no válido.' });
    }

    const data = await Model.find().populate(populateOptions).lean();

    if (data.length === 0) {
      return res.status(404).json({ message: `No se encontraron datos para el modelo ${model}.` });
    }

    // Convertir _id a id para mejor legibilidad en el Excel
    const formattedData = data.map(doc => {
      const newDoc = { ...doc };
      newDoc.id = newDoc._id.toString();
      delete newDoc._id;
      delete newDoc.__v;
      if (newDoc.user && model.toLowerCase() === 'appointment') {
        newDoc.user_name = newDoc.user.name;
        delete newDoc.user;
      }
      if (newDoc.service && model.toLowerCase() === 'appointment') {
        newDoc.service_name = newDoc.service.name;
        delete newDoc.service;
      }
      if (newDoc.mecanic && model.toLowerCase() === 'appointment') {
        newDoc.mecanic_name = newDoc.mecanic.name;
        delete newDoc.mecanic;
      }
      // Agregamos información de las citas para el modelo User
      if (model.toLowerCase() === 'user' && newDoc.appointments && newDoc.appointments.length > 0) {
        newDoc.appointment_ids = newDoc.appointments.map(appt => appt._id.toString());
        delete newDoc.appointments;
      }
      return newDoc;
    });

    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const exportDir = path.join(__dirname, '../../exports');
    await fs.mkdir(exportDir, { recursive: true }); //Se crea la carpeta "exports" si no existe
    const timestamp = Date.now();
    const exportFileName = `${model.toLowerCase()}s-${timestamp}.xlsx`;
    const exportFilePath = path.join(exportDir, exportFileName);

    await fs.writeFile(exportFilePath, excelBuffer);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(excelBuffer);

    console.log(`Archivo exportado guardado en la carpeta "exports" como: ${exportFileName}`);

  } catch (error) {
    console.error('Error durante la exportación a Excel:', error);
    res.status(500).json({ message: 'Error al exportar datos a Excel.', error: error.message });
  }
};


module.exports = { importDataFromExcel, exportDataToExcel };