const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Basic email validation regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6,  // Minimum length for password (you can adjust this)
    },
    refreshToken: { type: String },
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
