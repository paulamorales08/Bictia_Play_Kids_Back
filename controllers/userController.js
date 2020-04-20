const User = require('../models/user');
// const bcrypt = require('bcrypt');


let user = {
    create: function (req, res) {
        //Funcion para crear el usuario
        try {
            let body = req.body
            //Usamos los campos del modelo
            let newUser = new User({
                name: body.name,
                email: body.email,
                password: body.password,
                // password: bcrypt.hashSync(body.password, 10),
                role: body.role,
                birthday: body.birthday,
                createdDate: body.createdDate,
                profile: body.profile
            })

            newUser.save((err, userDB) => {
                if (err) {
                    return res.send({
                        statusCode: 400,
                        ok: false,
                        err: `Error al agregar el usuario:  ${err}`
                    })
                }
                
                return res.send({
                    statusCode: 200,
                    ok: true,
                    dataUser: userDB
                })
            })
        } catch (error) {
            res.send({
                ok: false,
                error: error
            })
        }
    }
}

module.exports = user