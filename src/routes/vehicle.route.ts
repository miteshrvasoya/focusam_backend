import express from "express";
import { createVehicle, getVehiclesByCustomerId } from "../controllers/vehicle.controller";

const router = express.Router();

// Route to fetch vehicles by customerId
router.get("/get_by_customer_id/:customerId", getVehiclesByCustomerId);
router.post("/", createVehicle);

export default router;
