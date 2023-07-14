const { response } = require('express')
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const usuariosGet = async(req = request, res ) => {
  //  const {q, nombre= "no nombre", page = 1, limit} = req.query
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado : true }

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
    .limit(Number(limite))
    .skip(Number(desde))
  ])

    res.json({   
      total, usuarios
    });
}

const usuariosPut = async (req, res = response) => {
    
    const id = req.params.id
    const { password, google, correo, ... resto }  = req.body
    
    if (password) {
      const salt = bcrypt.genSaltSync();
      resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    
    res.json({        
        usuario
    });
  }
  const usuariosPost = async (req, res = response) => {
   
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol })

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);


    await usuario.save();
    res.json({        
        usuario
    });
  } 

  const usuariosDelete =  async (req, res = response) => {
    console.log('ingresa a borrar');
    const { id } = req.params;

    const uid = req.uid;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false});

    res.json({        
      usuario
    });
  } 

module.exports = {usuariosGet, usuariosPut, usuariosPost, usuariosDelete}