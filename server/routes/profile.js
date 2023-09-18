const express = require("express");
const cors = require('cors');
const _ = require("underscore");
const Usuario = require("../models/usuarios");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middleware/autenticacion");

const app = express();
app.use(cors());

/**
 * Obtiene el perfil del usuario por el id
 */
app.post("/api/getDataProfileById", (req, resp) => {
    
  const body = req.body;
  const userId = body.userId;
  
  Usuario.findOne(
    { _id: userId }
  ).exec((err, usuario) => {    
      if (err) {
        return resp.status(500).json({
          ok: false,
          err,
        });
      }
      if (!usuario) {
        return resp.status(400).json({
          ok: false,
          err: {
            usernotfound: true,
          },
        });
      }     

      const info = {
        ok: true,
        name: usuario.name,
        web: usuario.web,
        
      } 

      resp.json(info);  
    
  });
});

/**
 * Obtiene el perfil del usuario
 */
app.post("/api/getDataProfile", [verificaToken], (req, resp) => {
    
  const usuarioId = req.usuarioid;

  Usuario.findOne(
    { _id: usuarioId }
  ).exec((err, usuario) => {    
      if (err) {
        return resp.status(500).json({
          ok: false,
          err,
        });
      }
      if (!usuario) {
        return resp.status(400).json({
          ok: false,
          err: {
            usernotfound: true,
          },
        });
      }     

      const info = {
        ok: true,
        profileId: usuario._id,
        role: usuario.role,
        email: usuario.email,
        name: usuario.name,
        web: usuario.web,
        phonehome: usuario.phonehome,
        phonecel: usuario.phonecel,
        rifRuc: usuario.rifRuc,
      }

      resp.json(info);
  });
});

/**
 * Guardar el perfil del usuario
 */
app.post("/api/saveDataProfile", [verificaToken], (req, resp) => {
    
  const usuarioId = req.usuarioid;

  const name = req.body.datos.name; 
  const rifRuc = req.body.datos.rifRuc; 
  const phonehome = req.body.datos.phonehome; 
  const phonecel = req.body.datos.phonecel; 
  const web = req.body.datos.web; 

  const update = { name,rifRuc,phonehome,phonecel,web};

  Usuario.findOneAndUpdate(
    {_id: usuarioId },update,{
      returnOriginal: false,
      upsert: true,
    }
  ).exec((err, usuario) => {
      if (err) {
        return resp.status(500).json({
          ok: false,
          err,
        });
      }
      if (!usuario) {
        return resp.status(400).json({
          ok: false,
          err: {
            usernotfound: true,
          },
        });
      }           
      
      resp.json({
          ok: true,
          saved: true
      });                  
  });
});

module.exports = app;