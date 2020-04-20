const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let profile = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    avatarUrl: {
        type: String,
        required: [true, 'Avatar Url is required']
    },
    favoriteSongs: [{
        type: Schema.Types.ObjectId,
        ref: 'Film'
    }],
    birthday: {
        type: Date,
        required: [true, 'Birthday is required']
    }
})

module.exports = mongoose.model('Profile', profile);