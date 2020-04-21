const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const allowRoles = {
    values: ['USER'] ,
    message: '{VALUE} no es un rol válido'
}

let user = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role:{
        type: String,
        default: 'USER',
        enum: allowRoles
    },
    birthday: {
        type: Date,
        required: [true, 'Birthday is required']
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    profiles: [{
        name: {
            type: String,
            default: "",
            required: [true, 'Name is required']
        },
        avatarUrl: {
            type: String,
            default: "",
            required: [true, 'Avatar Url is required']
        },
        birthday: {
            type: Date,
            default: Date.now,
            required: [true, 'Birthday is required']
        },
        favoriteSongs: [{
            type: Schema.Types.ObjectId,
            ref: 'Film'
        }]
    }]
});

user.plugin(uniqueValidator);

module.exports = mongoose.model('User', user);