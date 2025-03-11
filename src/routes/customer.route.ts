import express from "express";
import { createCustomer, getCustomers, getCustomersFromMobile } from "../controllers/customer.controller";

const router = express.Router();

router.post("/", createCustomer);
router.get("/", getCustomers);
router.get("/search_by_phone/:mo_no", getCustomersFromMobile);

export default router;
