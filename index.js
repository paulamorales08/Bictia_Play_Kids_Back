const mongoose = require('mongoose');
const app = require('./app');
const port = 3000;

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/bictiaPlayKids' ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (error, res) => {
       if(error){
           console.log("Error de conexión con BD" + error);
       } else {
           console.log("Conexión exitosa a la base de datos");
           app.listen(port, () => {
               console.log("Escuchando en el puerto ", port);
           });
       }
});