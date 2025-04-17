
    const mongoose = require("mongoose");

const heavyMachinerySchema = new mongoose.Schema({
    listingTitle: String,
    make: String,
    model: String,
    condition: String,
    inventoryLocation: String,
    transmission: String,
    fuelType: String,
    axleConfig: String,
    hotLocation: String,
    steering: String,
    color: String,
    category: String,
    price: Number,
    operationalHours: Number,
    year: Number,
    dealerStock: Boolean,
    carOptions: [String],
    description: String,
    adminNotes: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageBase64: String,
}, { timestamps: true });

module.exports = mongoose.models.HeavyMachinery || mongoose.model("HeavyMachinery", heavyMachinerySchema);


