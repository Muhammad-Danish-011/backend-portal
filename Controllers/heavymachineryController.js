const HeavyMachinery = require("../Models/heavyMachineryModel");

// GET heavy machinery
exports.getHeavyMachinery = async (req, res) => {
    try {
      const { userId } = req.query || req.body;
  
      const machines = userId
        ? await HeavyMachinery.find({ userId })
        : await HeavyMachinery.find();
  
      const machinesWithImages = machines.map((machine) => {
        const imageUrl = machine.imageBase64?.startsWith("data:image/")
          ? machine.imageBase64
          : machine.imageBase64
          ? `data:image/png;base64,${machine.imageBase64}`
          : "https://via.placeholder.com/150";
  
        return {
          ...machine.toObject(),
          imageUrl,
          imageBase64: undefined,
        };
      });
  
      res.status(200).json({ heavyMachineries: machinesWithImages });
    } catch (error) {
      console.error("Error fetching heavy machinery:", error);
      res.status(500).json({ message: "Failed to fetch heavy machinery", error });
    }
  };



// CREATE heavy machinery
exports.createHeavyMachinery = async (req, res) => {
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
      color,
      category,
      price,
      operationalHours,
      year,
      dealerStock,
      carOptions,
      description,
      adminNotes,
      userId,
      imageBase64,
    } = req.body;
  
    // ⚠️ Required field check
    if (!listingTitle || !make || !model || !price || !year || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const newMachine = new HeavyMachinery({
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
        color,
        category,
        price,
        operationalHours,
        year,
        dealerStock,
        carOptions,
        description,
        adminNotes,
        userId,
        imageBase64,
      });
  
      await newMachine.save();
  
      res.status(201).json({ message: "Heavy Machinery created successfully", heavyMachinery: newMachine });
    } catch (error) {
      console.error("Error creating heavy machinery:", error);
      res.status(500).json({ message: "Failed to create heavy machinery", error });
    }
  };