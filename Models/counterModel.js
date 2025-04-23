const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    model: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 },
});

const Counter = mongoose.model('counter', counterSchema);
module.exports = Counter;
