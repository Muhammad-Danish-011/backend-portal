const Truck = require("../Models/truckModel");

// GET trucks
exports.getTrucks = async (req, res) => {
  try {
    const { userId } = req.query || req.body;

    const trucks = userId ? await Truck.find({ userId }) : await Truck.find();

    const trucksWithImages = trucks.map((truck) => {
      const imageUrl = truck.imageBase64?.startsWith("data:image/")
        ? truck.imageBase64
        : truck.imageBase64
        ? `data:image/png;base64,${truck.imageBase64}`
        : "https://via.placeholder.com/150";

      return {
        ...truck.toObject(),
        imageUrl,
        imageBase64: undefined,
      };
    });

    res.status(200).json({ trucks: trucksWithImages });
  } catch (error) {
    console.error("Error fetching trucks:", error);
    res.status(500).json({ message: "Failed to fetch trucks", error });
  }
};

// CREATE truck
exports.createTruck = async (req, res) => {
  const {
    listingTitle,
    make,
    model,
    condition,
    inventoryLocation,
    transmission,
    fuelType,
    axleConfig,
    hotLocation,
    steering,
    year,
    mileage,
    price,
    description,
    category,
    color,
    engineSize,
    doors,
    seats,
    modelCode,
    auctionGrade,
    loadingCapacity,
    engineNumber,
    chassisNo,
    dimensionLength,
    dimensionWidth,
    dimensionHeight,
    carOptions,
    vin,
    stockNumber,
    dealerStock,
    userId,
    imageBase64,
  } = req.body;

  if (!model || !userId || !transmission || !fuelType || !color) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newTruck = new Truck({
      listingTitle,
      make,
      model,
      condition,
      inventoryLocation,
      transmission,
      fuelType,
      axleConfig,
      hotLocation,
      steering,
      year,
      mileage,
      price,
      description,
      category,
      color,
      engineSize,
      doors,
      seats,
      modelCode,
      auctionGrade,
      loadingCapacity,
      engineNumber,
      chassisNo,
      dimensionLength,
      dimensionWidth,
      dimensionHeight,
      carOptions,
      vin,
      stockNumber,
      dealerStock,
      userId,
      imageBase64,
    });

    await newTruck.save();

    res.status(201).json({ message: "Truck created successfully", truck: newTruck });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create truck" });
  }
};
