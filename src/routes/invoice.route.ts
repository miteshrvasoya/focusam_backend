import express from "express";
import { createInvoice, getInvoices } from "../controllers/invoice.controller";

const router = express.Router();

router.get("/", getInvoices);
router.post("/", createInvoice); // Create Invoice Route

export default router;
