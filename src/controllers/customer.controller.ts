import { Request, Response } from "express";
import Customer from "../models/customer.model";
import Invoice from "../models/invoice.model";
import vehicleModel from "../models/vehicle.model";

export const createCustomer = async (req: Request, res: Response) => {
    try {

        console.log("Creating the Customer");
        const { name, email, phone } = req.body;

        if (!name || !email || !phone ) {
            res.status(400).json({ success: false, message: "All fields except notes are required" });
            return;
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });
        if (existingCustomer) {
            res.status(400).json({ success: false, message: "Customer with this email or phone already exists" });

            return;
        }

        const customer = new Customer({ name, email, phone });
        await customer.save();

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
        return;
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
};


export const getCustomers = async (req: Request, res: Response) => {
    try {
        // Fetch customers
        const customers = await Customer.find().sort({ createdAt: -1 });

        // Fetch all invoices related to the customers
        const customerIds = customers.map(customer => customer._id);
        const invoices = await Invoice.find({ customerId: { $in: customerIds } });

        // Calculate total spent for each customer
        const customerTotalSpentMap = invoices.reduce((acc, invoice) => {
            acc[invoice.customerId] = (acc[invoice.customerId] || 0) + invoice.amount;
            return acc;
        }, {} as Record<string, number>);

        res.status(200).json({
            success: true,
            data: customers.map((customer: any) => ({
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                lastVisit: new Date().toISOString(), // Placeholder, replace with actual visit logic
                totalSpent: customerTotalSpentMap[customer._id.toString()] || 0, // Get total spent
                invoices: invoices.filter((inv: any) => inv.customerId.toString() === customer._id.toString()), // Get related invoices
                notes: customer.notes,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getCustomersFromMobile = async (req: Request, res: Response) => {
    try {
        let phone = req.params.mo_no;

        console.log("Search String: ", phone);
        // Check if customer already exists
        const customer :any= await Customer.findOne({
            phone: phone, // Matches phone number anywhere in the string
          });
          

        console.log("Customer Details:", customer);
        
        if(customer && Object.keys(customer).length) {
            res.status(200).json({
                success: true,
                data: {
                    id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                    lastVisit: new Date().toISOString(), // Placeholder, replace with actual visit logic
                    totalSpent: 0, // Placeholder, replace with actual total spent logic
                    invoices: [], // Placeholder, replace with actual invoices linked to the customer
                    notes: customer.notes,
                    createdAt: customer.createdAt,
                    updatedAt: customer.updatedAt,
                },
            });
            return;
        } else {
            res.status(200).json({
                success: true,
                data: {},
            });
            return;
        }

        
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
};

export const getCustomerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        console.log("Fetching customer details for ID:", id);

        if (!id) {
            res.status(400).json({ success: false, message: "Customer ID is required" });
            return;
        }

        // Fetch customer by ID
        const customer = await Customer.findById(id);

        console.log("Customers: ", customer);

        if (!customer) {
            res.status(404).json({ success: false, message: "Customer not found" });
            return;
        }

        // Fetch invoices linked to this customer
        const invoices = await Invoice.find({ customerId: id });

        console.log("Invoices:", invoices);

        // Fetch vehicles linked to this customer
        const vehicles = await vehicleModel.find({ customerId: id });

        console.log("Vehicles:", vehicles);

        res.status(200).json({
            success: true,
            data: {
                customer: {
                    id: customer._id,
                    customer_id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                    notes: customer.notes,
                },
                invoices: invoices.map((invoice) => ({
                    invoice_id: invoice._id,
                    amount: invoice.amount,
                    status: invoice.status,
                    date: invoice.date,
                    dueDate: invoice.dueDate,
                })),
                vehicles: vehicles.map((vehicle: any) => ({
                    vehicle_id: vehicle._id,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    registration: vehicle.registration,
                    color: vehicle.color,
                    odometer: vehicle.odometer,
                    status: vehicle.status,
                    lastServiceDate: vehicle.lastServiceDate || vehicle.updatedAt, // Use updated_date if lastServiceDate is not available
                })),
            },
        });
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
