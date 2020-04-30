const User = require('../models/user');
const Films = require('../models/films');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

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
                password: bcrypt.hashSync(body.password, 10),
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
                sendEmail(body.email,body.name) // se envia correo cuando se registra un usuario
                
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
            
            let newProfiles = [];
            newProfiles = user.profiles;
            newProfiles.push(profile);


            User.findByIdAndUpdate(userId, {profiles: newProfiles}, (err)=> {
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
    getOneProfile: function(req, res){
        let userId = req.params.id;
        let profileName = req.body.name;
        User.findOne({"_id" : userId, "profiles.name": profileName }, (err, user) => {
            if(err) {
                return res.send({
                    statusCode: 500,
                    message: 'Error en el servidor'
                })
            }
            if(!user) {
                return res.send({
                    statusCode: 400,
                    message: 'No hay un perfil registrado'
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
    addFavorite: function(req,res){
        let userId = req.params.id;
        let profileName = req.body.name;
        let filmId = mongoose.Types.ObjectId(req.body.filmId);
        console.log(req.body);
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
            for (let i = 0; i < user.profiles.length; i++) {
                if (user.profiles[i].name === profileName) {
                    newFavoriteList = user.profiles[i].favoriteFilms;
                    if(newFavoriteList.includes(filmId)) {
                    	return res.send({
                    	    statusCode: 400,
                    	    message: 'La cancion ya esta en favoritos'
                    	});
                    }                    
                    newFavoriteList.push(filmId);
                }  
            }
            
            User.findOneAndUpdate({"_id" : userId, "profiles.name": profileName}, { $set: { "profiles.$.favoriteFilms" : newFavoriteList} }, (err, user) => {
                if(err){
                    return res.send({
                        statusCode: 500,
                        message: 'Error en el servidor',
                        error: err
                    });
                }
                if(!user){
                    return res.send({
                        statusCode: 400,
                        message: "Perfil no registrado"
                    })
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
                        return res.send({
                            statusCode: 200,
                            user
                        })
                    });
            })
        });
    },
    removeFavorite: function(req,res) {
        let userId = req.params.id;
        let profileName = req.body.name;
        let filmId = req.body.filmId;

        User.findById(userId, (err, user)=> {
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
            for (let i = 0; i < user.profiles.length; i++) {
                if (user.profiles[i].name === profileName) {
                    newFavoriteList = user.profiles[i].favoriteFilms;
                    newFavoriteList = newFavoriteList.filter(item => item != filmId);
                }  
            }
            User.findOneAndUpdate({"_id" : userId, "profiles.name": profileName}, { $set: { "profiles.$.favoriteFilms" : newFavoriteList} }, (err, user) => {
                if(err){
                    return res.send({
                        statusCode: 500,
                        message: 'Error en el servidor',
                        error: err
                    });
                }
                if(!user){
                    return res.send({
                        statusCode: 400,
                        message: "Perfil no registrado"
                    })
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
                        return res.send({
                            statusCode: 200,
                            user
                        })
                    });
            })
        });
    },
    listFavoriteFilms: function(req, res){
        let userId = req.params.id
        User.findById(userId, (err, user)=> {
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
            Films.populate(user, {path: "profiles.favoriteFilms"}, (err, user)=>{
                if(err){
                    return res.send({
                        statusCode: 500,
                        message: 'Error en el servidor'
                    })
                }
                if(!user){
                    return res.send({
                        statusCode: 400,
                        message: 'Las canciones no existen'
                    })
                }
                return res.send({
                    statusCode: 200,
                    user 
                })
            })
        }); 
    }
}

function sendEmail(email,name){
    console.log("entro a send email")
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'bictiaplaygroup@gmail.com', 
          pass: 'B1ct1@Kids'
        }
      }));
    
    var mailOptions = {
      from: 'bictiaplaygroup@gmail.com',
      to: email,
      subject: 'Registro exitoso',
      html: '<center><img width="150px" alt="BictiaPlayKids" src="http://xtrategik.net/logo.png"><h1>Bienvenid@ '+name+'!!!</h1> <h3>Tu registro se completó satisfactoriamente, ahora puedes disfrutar de todo nuestro contenido.</h3> <h3>Gracias por preferirnos</h3><br><br><span style="font-size: 14px color: grey;">2020 - Bictia Play Kids - Todos los derechos reservados.</span></center>'
    };
    
    console.log("Enviando email", mailOptions);
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("ERROR!!!!!!", error);
      } else {
        console.log('Correo enviado: ' + info.response);
      }
    });
}

module.exports = user
