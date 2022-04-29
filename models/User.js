const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    roles: {
        User: {
            type: Number,
            default: 2000
        },
        Moderator: Number,
        Admin: Number
    },
    refreshToken: [String]
});


module.exports = mongoose.model('User', userSchema);