const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Counter = require('./counterModel');  // Import counter model

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: { type: Number, unique: true, required: true },
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

UserSchema.pre('save', async function(next) {
    if (!this.isNew) return next();  // Proceed if it's an update, not new

    try {
        const counter = await Counter.findOneAndUpdate(
            { model: 'User' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }  // Create a new counter if not found
        );

        console.log('Counter:', counter);  // Log the counter to check if it's valid
        this.userId = counter.seq;  // Set the userId to the incremented value

        if (isNaN(this.userId)) {
            throw new Error('Invalid userId value');
        }

        next();
    } catch (error) {
        next(error); // If there is an error, move to the next middleware
    }
});


const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
