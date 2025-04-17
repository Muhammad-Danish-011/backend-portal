const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    listingTitle: {
        type: String,
        required: true,
    },
    dealerStock: {
        type: Boolean,  // Should be a boolean for in-stock or not
        required: false,
        default: false,  // Default value to false if not provided
    },
    make: {
        type: String,
        required: true,
    },
    model: String,
    condition: String,
    inventoryLocation: String,
    transmission: String,
    fuelType: String,
    drivetrain: String,
    hotLocation: String,
    steering: String,
    color: String,
    bodyType: String,
    engineSize: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    doors: {
        type: Number,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    modelCode: String,
    auctionGrade: String,
    loadingCapacity: Number,
    mileage: Number,
    engineNumber: String,
    chassisNo: String,
    dimensionLength: Number,
    dimensionWidth: Number,
    dimensionHeight: Number,
    carOptions: [String],  // Options like AC, Power Steering, etc.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User collection
        required: true,
    },
    stockNumber: String,
    vin: String,
    imageBase64: String,
    description: String,
}, { timestamps: true });

module.exports = mongoose.models.Car || mongoose.model("Car", carSchema);
