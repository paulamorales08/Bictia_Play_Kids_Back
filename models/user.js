const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const profile = require('./profiles');

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
        required: [true, 'Created Date is required']
    },
    profiles: [{
        type: profile
    }]
});

user.plugin(uniqueValidator);

module.exports = mongoose.model('User', user);