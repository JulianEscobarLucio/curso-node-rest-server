const { response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async (req, res = response) => { 

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ correo }); 
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado : false'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        const token = await generarJWT(usuario.id);


        res.json({
           usuario, token
        })
    } catch (err) { 
        return res.json({
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    login
}