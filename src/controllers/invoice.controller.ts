import { Request, Response } from "express";
import Invoice from "../models/invoice.model";

// Fetch Invoice List with Pagination, Search, and Filtering
export const getInvoices = async (req: Request, res: Response) => {
    try {
        let { page = "1", limit = "5", status, search } = req.query;

        const currentPage = parseInt(page as string, 10) || 1;
        const itemsPerPage = parseInt(limit as string, 10) || 5;

        let filter: any = {};

        // Apply status filter if provided
        if (status && status !== "all") {
            filter.status = status;
        }

        // Apply search filter for customerName or vehicleNumber
        if (search) {
            filter.$or = [
                { customerName: { $regex: search, $options: "i" } },
                { vehicleNumber: { $regex: search, $options: "i" } }
            ];
        }

        // Get total count for pagination
        const totalItems = await Invoice.countDocuments(filter);

        // Fetch paginated data
        const invoices = await Invoice.find(filter)
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.status(200).json({
            success: true,
            data: {
                items: invoices.map((invoice) => ({
                    id: invoice._id,
                    //   customer: invoice?.customerName,
                    //   vehicle: invoice?.vehicleNumber,
                    date: invoice.createdAt,
                    amount: invoice.amount,
                    status: invoice.status,
                })),
                totalItems,
                totalPages: Math.ceil(totalItems / itemsPerPage),
                currentPage,
            },
        });
        return;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
};


const generateInvoiceNumber = async (): Promise<string> => {
    const latestInvoice: any = await Invoice.findOne().sort({ createdAt: -1 });
    let newNumber = 1;

    if (latestInvoice) {
        newNumber = parseInt(latestInvoice.invoiceNumber, 10) + 1;
    }

    return newNumber.toString().padStart(6, "0"); // Generates like '000001', '000002'
};

export const createInvoice = async (req: Request, res: Response) => {
    try {
        const { customerId, vehicleId, date, dueDate, status, paymentMethod, notes, services, amount } = req.body;

        if (!customerId || !vehicleId || !date || !dueDate || !status || !paymentMethod || !services.length || !amount) {
            res.status(400).json({ success: false, message: "All fields are required" });
        }

        const invoiceNumber = await generateInvoiceNumber();

        console.log("Req Data: ", req.body);

        const invoice = new Invoice({ invoiceNumber, customerId, vehicleId, date, dueDate, status, paymentMethod, notes, amount, services });
        await invoice.save();

        res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            data: invoice,
        });
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

