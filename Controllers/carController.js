const Car = require('../Models/carModel');


exports.getCars = async (req, res) => {
    try {
      const { userId } = req.query || req.body;
      const cars = userId ? await Car.find({ userId }) : await Car.find();
  
      const carsWithImages = cars.map((car) => {
        const imageUrl = car.imageBase64?.startsWith("data:image/")
        ? car.imageBase64
        : car.imageBase64 
          ? `data:image/png;base64,${car.imageBase64}` 
          : "https://via.placeholder.com/150";
      
  
        return {
          ...car.toObject(),
          imageUrl,
          imageBase64: undefined,
        };
      });
  
      res.status(200).json({ cars: carsWithImages });
    } catch (error) {
      console.error("Error fetching cars:", error);
      res.status(500).json({ message: 'Failed to fetch cars', error });
    }
  };
  


// Create a new car

exports.createCar = async (req, res) => {
    const {
        listingTitle,
        make,
        model,
        condition,
        inventoryLocation,
        transmission,
        fuelType,
        drivetrain,
        hotLocation,
        steering,
        color,
        bodyType,
        engineSize,
        year,
        price,
        doors,
        seats,
        modelCode,
        auctionGrade,
        loadingCapacity,
        mileage,
        engineNumber,
        chassisNo,
        dimensionLength,
        dimensionWidth,
        dimensionHeight,
        carOptions,
        userId,
        stockNumber,
        vin,
        imageBase64,
        description,
    } = req.body;

    // ✅ Corrected required fields
    if (!model || !userId || !transmission || !fuelType || !color) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newCar = new Car({
            listingTitle,
            make,
            model,
            condition,
            inventoryLocation,
            transmission,
            fuelType,
            drivetrain,
            hotLocation,
            steering,
            color,
            bodyType,
            engineSize,
            year,
            price,
            doors,
            seats,
            modelCode,
            auctionGrade,
            loadingCapacity,
            mileage,
            engineNumber,
            chassisNo,
            dimensionLength,
            dimensionWidth,
            dimensionHeight,
            carOptions,
            userId,
            stockNumber,
            vin,
            imageBase64,
            description
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
