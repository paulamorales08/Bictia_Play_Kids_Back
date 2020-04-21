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
                profiles: body.profiles
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
    },
    addProfile: function(req,res){
        let userId = req.params.id;
        let profile = {
            name: req.body.name,
            avatarUrl: req.body.avatarUrl,
            birthday: req.body.birthday
        }

        User.findById(userId).exec((err, user)=> {
            if(err){
                return res.send({
                    statusCode: 500,
                    message: 'Error en el servidor'
                });
            }
            if(!user){
                return res.send({
                    statusCode: 400,
                    message: 'No existe el usuario'
                });
            }
            
            let newFavoriteList = [];
            newFavoriteList = user.profiles;
            newFavoriteList.push(profile);
            console.log(newFavoriteList)

            User.findByIdAndUpdate(userId, {profiles: newFavoriteList}, (err)=> {
                if(err){
                    return res.send({
                        statusCode: 500,
                        message: 'Error al realizar petición',
                        error: err
                    });
                }
                User.findById(userId)
                    .exec((err, user)=>{
                        if (err) {
                            return res.send({
                                status: 500,
                                message: 'Error en la peticón'
                            });
                        }
                        if (!user) {
                            return res.send({
                                message: 'No existe el usuario'
                            });
                        }
                        // Devolver el resultado
                        return res.send({
                            status: 200,
                            user
                        });
                    });
            })
        });
    },
    getProfiles: function(req, res){
        let userId = req.params.id;
        User.findById(userId, "profiles", (err, user)=> {
            if(err){
                return res.send({
                    statusCode: 500,
                    message: 'Error en el servidor'
                })
            }
            if(!user){
                return res.send({
                    statusCode: 400,
                    message: 'El usuario no existe'
                })
            }
            return res.send({
                statusCode: 200,
                user
            })
        })
    },

    login: function (req, res) {
        
        let body = req.body;
        User.findOne({ email: body.email },
            (error, userLogged) => {
                if (error) {
                    return res.send({
                        message: 'Error en el servidor',
                        statusCode: 500
                    })
                }
                
                if (!userLogged) {
                    return res.send({
                        menssage: 'Por favor veifique los datos ingresados',
                        statusCode: 400
                    })
                } else {
                    bcrypt.compare(body.password, userLogged.password,
                        (err, check) => {
                            
                            if (check) {
                                                         
                                
                                return res.send({
                                    menssage: 'Inicio de sesion correcto',
                                    statusCode: 200,
                                    dataUser: userLogged,
                                    token: token
                                });
                            } else {
                                return res.send({
                                    message: 'Por favor veifique los datos ingresados',
                                    statusCode: 401
                                })
                            }
                        }
                    )
                }
            }
        )
    },
}

module.exports = user