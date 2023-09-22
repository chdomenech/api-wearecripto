const express = require("express");
const cors = require('cors');
const Module = require("../models/modules");
const {
  verificaToken
} = require("../middleware/autenticacion");
const app = express();
app.use(cors());

app.post("/api/module/saveModule", [verificaToken], (req, resp) => {

  let body = req.body.data;
  const module = new Module({
    order: body.order,
    title: body.title,
    course: body.couse,
  });

  module.save((err, moduleDB) => {

    if (err) {
      return resp.status(400).json({
        ok: false,
        err,
      });

    } else {
      resp.json({
        ok: true,
        saved: true,
        module: moduleDB
      });
    }
  });
});

/**
 * Actualiza el modulo
 */
app.post("/api/module/updateModule", [verificaToken], (req, resp) => {

  let body = req.body.data;
  const moduleId = body._id;
  
  const module = {
    order: body.order,
    title: body.title,    
  };

  Module.findOneAndUpdate(
    { _id: moduleId }, module, {
    new: true
  }
  ).exec((err, moduleupdate) => {
    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    if (!moduleupdate) {
      return resp.status(400).json({
        ok: false,
        err: {
          modulenotfound: true,
        },
      });
    }

    resp.json({
      ok: true,
      saved: true,
      module: moduleupdate
    });

  });
});



/**
 * lista todos los modulos activos
 */
app.post("/api/module/findAllModules", async (req, resp) => {

  Module.find().sort({ updated_at: -1 }).exec((err, modules) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    else {
      resp.json({
        ok: true,
        modules
      });
    }
  });
});



/**
 * Busca un modulo
 */
app.post("/api/module/findModule", [verificaToken], async (req, resp) => {

  const moduleId = req.body.moduleId;
  Module.findOne({ _id: moduleId }).exec((err, module) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    else {
      resp.json({
        ok: true,
        saved: true,
        module
      });
    }
  });
});


/**
 * Borra el modulo
 */
app.post("/api/module/deleteModule", [verificaToken], async (req, resp) => {

  var moduleId = req.body.module_id;
  Module.findOne({ _id: moduleId }).exec((err, module) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }

    if (module.image_id) {
      cloudinary.v2.api.delete_resources(module.image_id)
        .then(result => console.log(result));
    }
    Module.remove({ _id: moduleId }, function (err) {
      if (err) {
        return resp.status(500).json({
          ok: false,
          err,
        });
      }
      else {

        resp.json({
          ok: true
        });
      }
    });
  });
});

/**
 * Activa/Desactiva el curso
 */
app.post("/api/module/activateModule", [verificaToken], (req, resp) => {

  let body = req.body;

  const moduleId = body.module;
  const status = body.status;

  const module = {
    status
  };

  Module.findOneAndUpdate(
    { _id: moduleId }, module, {
    new: true
  }
  ).exec((err, courupdate) => {
    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    if (!courupdate) {
      return resp.status(400).json({
        ok: false,
        err: {
          modulenotfound: true,
        },
      });
    }

    resp.json({
      ok: true,
      saved: true,
      module: courupdate
    });

  });
});

/**
 * Lista todos los cursos activos
 */
app.post("/api/module/findAllModulesActive", async (req, resp) => {

  Module.find({ status: true }).sort({ updated_at: -1 }).exec((err, modules) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    else {
      resp.json({
        ok: true,
        modules
      });
    }
  });
});





module.exports = app;