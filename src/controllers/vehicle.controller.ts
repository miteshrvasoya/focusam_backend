import { Request, Response } from "express";
import Vehicle from "../models/vehicle.model";

export const getVehiclesByCustomerId = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    console.log("Fetching Vehicles By Customer ID");

    if (!customerId) {
      res.status(400).json({ success: false, message: "Customer ID is required" });
      return;
    }

    // Fetch all vehicles linked to this customer
    const vehicles = await Vehicle.find({ customerId });

    if (!vehicles.length) {
      res.status(404).json({ success: false, message: "No vehicles found for this customer" });
      return;
    }

    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};


// Controller to add a new vehicle
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { customerId, make, model, year, registration, vin, color, odometer, status, notes } = req.body;

    // Validation (ensure customerId, make, and model exist)
    if (!customerId || !make || !model) {
      res.status(400).json({ message: "Customer ID, make, and model are required." });
      return;
    }

    // Check for duplicate registration number (if provided)
    if (registration) {
      const existingVehicle = await Vehicle.findOne({ registration });
      if (existingVehicle) {
        res.status(400).json({ message: "A vehicle with this registration number already exists." });
        return;
      }
    }

    // Create new vehicle
    const newVehicle = new Vehicle({
      customerId,
      make,
      model,
      year,
      registration,
      vin,
      color,
      odometer,
      status,
      notes,
    });

    // Save to DB
    const savedVehicle = await newVehicle.save();
    res.status(200).json({ success: true, data: savedVehicle });
    return;
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
};
