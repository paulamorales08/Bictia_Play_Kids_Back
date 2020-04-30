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
    url: {
        type: String,
        required: [true, 'Film url is required']
    },
    urlImage: {
        type: String,
        required: [true, 'Image url is required']
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    createBy:{
        type: String,
        required: [true, 'Film createdBy user is required']
    }
})

module.exports = mongoose.model('Film', film);