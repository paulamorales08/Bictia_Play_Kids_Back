const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let film = new Schema({
    name: {
        type: String,
        required: [true, 'Film name is required']
    },
    category: {
        type: String,
        required: [true, 'Film category is required']
    },
    type: {
        type: String,
        required: [true, 'Film type is required']
    },
    filmUrl: {
        type: String,
        required: [true, 'Film url is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image url is required']
    },
    createdDate: {
        type: Date,
        required: [true, 'Film createdDate date is required']
    },
    createdBy:{
        type: String,
        required: [true, 'Film createdBy user is required']
    }
})

module.exports = mongoose.model('film', film);