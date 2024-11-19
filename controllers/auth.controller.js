const bcrypt = require('bcrypt')
const {usuario, rol, Sequelize} = require('../models')
const {GeneraToken, TiempoRestanteToken} = require('../services/jwttoken.service')

let self = {}

//POST: api/auth
self.login = async function(req, res, next) {
    const {email, password} = req.body

    try{
        let data = await usuario.findOne({
            where: {email: email},
            raw: true,
            attributes: ['id','email','nombre','passwordhash',[Sequelize.col('rol.nombre'),'rol']],
            include: {model:rol, attributes:[]}
        })
        if(data===null){
            return res.status(401).json({mensaje:'Usuario o contraseña incorrectos'})
        }
        //validacion de contraseña contra el hash almacenado
        const passwordMash = await bcrypt.compare(password,data.passwordhash)
        if(!passwordMash){
            return res.status(401).json({mensaje:'Usuario o contraseña incorrectos'})
        }

        //utilizamos los nombres de claim estandar
        token = GeneraToken(data.email, data.nombre, data.rol)

        //bitacora
        req.bitacora("usuario.login",data.email)

        res.status(200).json({
            email: data.email,
            nombre: data.nombre,
            rol:data.rol,
            jwt:token
        })
    } catch(error){
        next(error)
    }
}

//GET: api/auth/tiempo
self.tiempo = async function (req, res) {
    const tiempoRestante = TiempoRestanteToken(req); // Llama a la función para obtener el tiempo restante del token.

    if (tiempoRestante === null) {
        return res.status(404).json({ mensaje: 'Token inválido o expirado' }); // Si no hay tiempo restante, el token es inválido o ha expirado.
    }

    return res.status(200).json({ tiempoRestante: tiempoRestante }); // Devuelve el tiempo restante en segundos en el cuerpo de la respuesta.
}


module.exports = self