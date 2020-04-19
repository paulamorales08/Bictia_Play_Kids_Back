const Film = require('../models/films');


let films = {

    create: function (req, res) {
        //Agregar nueva canción a la base de datos
        try {
            let body = req.body
            //Usando modelo de nueva canción
            let newFilm = new Film({
                name:  body.name,
                category: body.category,
                type: body.type,
                filmUrl: body.filmUrl,
                imageUrl: body.imageUrl,
                createdDate: body.createdDate,
                createdBy: body.createdBy
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
    }
}

module.exports = films