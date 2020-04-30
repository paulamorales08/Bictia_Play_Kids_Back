const Film = require('../models/films');


let films = {

    create: function (req, res) {
        //Agregar un nuevo film 
        try {
            let body = req.body
            //Usando modelo para nuevo film
            let newFilm = new Film({
                name:  body.name,
                category: body.category,
                type: body.type,
                url: body.url,
                urlImage: body.urlImage,
                createDate: body.createDate,
                createBy: body.createBy
            })
            
            newFilm.save((err, filmDB) => {
                console.log(newFilm)
                if (err) {
                    res.status(400).send({
                        statusCode: 400,
                        ok: false,
                        err: 'Error al agregar un nuevo film'
                    })
                } else {
                    res.status(200).send({
                        statusCode: 200,
                        ok: true,
                        created: filmDB
                    }) 
                }    
            })
        } catch (error) {
            console.log(error)
        }
    },

    delete: function (req, res){
        
    },

    getFilms: function (req, res) {
        //Trae los films almacenados
        try {
            Film.find().exec((err,videos) =>{
                if (err || !videos) {
                    return res.status(400).send({
                        statusCode: 400,
                        status: 'Error',
                        message: 'No hay videos existentes'
                    });
                }
                return res.status(200).send({
                    statusCode: 200,
                    status: 'Success',
                    films: videos
                })
            })
        } catch (error) {
            console.log(error);
        }
        
    },

    typeHead: function (req, res) {
        //Trae los videos por el nombre
        try {
            let name = req.query.name;
            Film.find({
                'name': {
                    "$regex": `${name}`, //Permite buscar coincidencias en las consultas a la BD.
                    "$options": "i" //Permite que $regex no sea sencible a las mayusculas y las minusculas.
                } 
            }).exec( (err, coincidences) =>{
                if (err) {
                    return res.status(500).send({
                        message: `Error en el servidor ${err}`,
                        statusCode: 500
                    })
                }else if (coincidences.length === 0) {
                    return res.status(400).send({
                        message: 'No se ha encontrado un video con ese nombre',
                        statusCode: 400
                    })
                }else{
                    return res.status(200).send({
                        statusCode: 200,
                        status: 'Success',
                        results: coincidences
                    })
                }
            } )
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = films