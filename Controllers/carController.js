const Car = require('../Models/carModel');


exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find();

        // Image URL generate karna for Base64 image string
        const carsWithImages = cars.map(car => {
            // Base64 ko prepend karke ek valid image URL banayein
            const imageUrl = car.imageBase64 ? `data:image/png;base64,${car.imageBase64}` : "https://via.placeholder.com/150"; // Default image agar base64 nahi hai
            return {
                ...car.toObject(),
                imageUrl,  // Base64 ko image URL format mein convert karke bhejein
                imageBase64: undefined // Remove base64 from the response
            };
        });

        res.status(200).json({ cars: carsWithImages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch cars' });
    }
};



// Create a new car

exports.createCar = async (req, res) => {
    const { stockId, modelName, mileage, trim, additionalInfoEn, additionalInfoAr, saudiSwitch, price, description, make, year, exportOption, registrationCity, vinNumber, numberOfDoors, engineSize, imageBase64, userId, transmission, fuelType, color } = req.body;

    // Required field check
    if (!modelName || !userId || !transmission || !fuelType || !color) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newCar = new Car({
            stockId,
            modelName,
            mileage,
            trim,
            additionalInfoEn,
            additionalInfoAr,
            saudiSwitch,
            price,
            description,
            make,
            year,
            exportOption,
            registrationCity,
            vinNumber,
            numberOfDoors,
            engineSize,
            imageBase64, // Yeh ab DB me save hoga.
            imageUrl: imageBase64, 
            userId,
            transmission,
            fuelType,
            color
        });

        await newCar.save();
        res.status(201).json({
            message: 'Car created successfully',
            car: newCar
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create car' });
    }
};
