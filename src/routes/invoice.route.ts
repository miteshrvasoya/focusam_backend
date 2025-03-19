import express from "express";
import { createInvoice, getInvoiceById, getInvoices } from "../controllers/invoice.controller";

const router = express.Router();

router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice); // Create Invoice Route

export default router;
