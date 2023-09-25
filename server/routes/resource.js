const express = require("express");
const cors = require('cors');
const Resource = require("../models/resources");
const Module = require("../models/modules");
const {
  verificaToken
} = require("../middleware/autenticacion");
const app = express();
app.use(cors());

app.post("/api/resource/saveResource", [verificaToken], (req, resp) => {

  let body = req.body.data;
  const resource = new Resource({
    module: body.module,
    order: body.order,
    title: body.title,
    url: body.url,
    time: body.time
  });

  resource.save((err, resourceDB) => {

    if (err) {
      return resp.status(400).json({
        ok: false,
        err,
      });

    } else {

      Module.findOne({ _id: body.module }).exec((err, module) => {
        if (err) {
          return resp.status(500).json({
            ok: false,
            err,
          });
        }

        if (!module) {
          return resp.status(400).json({
            ok: false,
            err: {
              modulenotfound: true,
            },
          });
        }
        else if (module) {

          resources_modules = module.resources;
          resources_modules.push(resourceDB._id);

          const resourcesIds = {
            resources: resources_modules
          }

          Module.findOneAndUpdate(
            { _id: body.module }, resourcesIds, {
            new: true
          }
          ).exec((err, moduleUpdate) => {
            if (err) {
              return resp.status(500).json({
                ok: false,
                err,
              });
            }
            if (!moduleUpdate) {
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
              resource: resourceDB
            });
          });
        }
      });
    }
  });
});



/**
 * Actualiza el recurso
 */
app.post("/api/resource/updateResource", [verificaToken], (req, resp) => {

  let body = req.body.data;
  const resourceId = body._id;

  const resource = {
    order: body.order,
    title: body.title,
    url: body.url,
    time: body.time
  };

  Resource.findOneAndUpdate(
    { _id: resourceId }, resource, {
    new: true
  }
  ).exec((err, resourceUpdate) => {
    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    if (!resourceUpdate) {
      return resp.status(400).json({
        ok: false,
        err: {
          resourcenotfound: true,
        },
      });
    }

    resp.json({
      ok: true,
      saved: true,
      resource: resourceUpdate
    });

  });
});

/**
 * Busca un recurso
 */
app.post("/api/resource/findResources", [verificaToken], async (req, resp) => {

  const moduleId = req.body.moduleId;
  Resource.find({ module: moduleId }).sort({ order: 1 }).exec((err, resources) => {

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
        resources
      });
    }
  });
});


/**
 * Borra el recurso
 */
app.post("/api/resource/deleteResource", [verificaToken], async (req, resp) => {

  var resourceId = req.body.resource_id;
  Resource.remove({ _id: resourceId }, function (err) {
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

/**
 * Activa/Desactiva el curso
 */
app.post("/api/resource/activateResource", [verificaToken], (req, resp) => {

  let body = req.body;

  const resourceId = body.resource;
  const status = body.status;

  const resource = {
    status
  };

  Resource.findOneAndUpdate(
    { _id: resourceId }, resource, {
    new: true
  }
  ).exec((err, resour) => {
    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    if (!resour) {
      return resp.status(400).json({
        ok: false,
        err: {
          resourcenotfound: true,
        },
      });
    }

    resp.json({
      ok: true,
      saved: true,
      resource: resour
    });

  });
});

/**
 * Lista todos los cursos activos
 */
app.post("/api/resource/findAllResourcesActive", async (req, resp) => {

  Resource.find({ status: true }).sort({ updated_at: -1 }).exec((err, resources) => {

    if (err) {
      return resp.status(500).json({
        ok: false,
        err,
      });
    }
    else {
      resp.json({
        ok: true,
        resources
      });
    }
  });
});

module.exports = app;