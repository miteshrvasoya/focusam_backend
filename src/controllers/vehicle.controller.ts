import { Request, Response } from "express";
import Vehicle from "../models/vehicle.model";

export const getVehiclesByCustomerId = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    console.log("Fetching Vehicles By Customer ID");

    if (!customerId) {
      res.status(400).json({ success: false, message: "Customer ID is required" });
    }

    // Fetch all vehicles linked to this customer
    const vehicles = await Vehicle.find({ customerId });

    if (!vehicles.length) {
      res.status(404).json({ success: false, message: "No vehicles found for this customer" });
    }

    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
