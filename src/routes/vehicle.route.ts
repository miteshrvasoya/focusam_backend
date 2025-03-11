import express from "express";
import { getVehiclesByCustomerId } from "../controllers/vehicle.controller";

const router = express.Router();

// Route to fetch vehicles by customerId
router.get("/get_by_customer_id/:customerId", getVehiclesByCustomerId);

export default router;
