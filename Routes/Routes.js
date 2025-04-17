// carRoutes.js
const express = require('express');
const { getCars, createCar } = require('../Controllers/carController');
const { ensureAuthenticated } = require('../Middlewares/ensureAuthenticated');
const Car = require('../Models/carModel'); // Import your Car model
const truckController = require("../Controllers/truckController");
const {
    getHeavyMachinery,
    createHeavyMachinery,
  } = require("../Controllers/heavymachineryController");

const router = express.Router();

// Get all cars for the logged-in user
router.get('/cars', ensureAuthenticated, getCars);

// Create a new car listing
router.post('/cars', ensureAuthenticated, createCar);

// Fetch cars for a specific user
router.get("/user", ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;  // Use _id from the decoded token
        console.log("UserID:", userId);  // Log user ID to verify it's correct

        const cars = await Car.find({ userId }).select("-imageBase64");  // Exclude base64 image from response
        console.log("Fetched Cars:", cars);  // Log the fetched cars to see the result

        if (!cars || cars.length === 0) {
            return res.status(404).json({ message: "No cars found for this user" });
        }

        return res.status(200).json({ cars });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch cars", error: err.message });
    }
});

//truck 
router.get("/truck", truckController.getTrucks);
router.post("/truck", truckController.createTruck);


//heavy machinery
router.get("/heavy", getHeavyMachinery);
router.post("/heavy", createHeavyMachinery);

module.exports = router;
