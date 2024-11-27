import { Router } from "express";
import { addPayment, getAllPayments, getPaymentById, getPaymentStats, markAsPaid } from "../controllers/paymentControllers.js";

const paymentRoutes = Router();

paymentRoutes.get('/get-all-payments',getAllPayments)
paymentRoutes.get('/get-payment-by-id/:id',getPaymentById)
paymentRoutes.get('/get-payment-stats',getPaymentStats);
paymentRoutes.put('/mark-payment-paid/:id',markAsPaid);
paymentRoutes.post('/add-payment',addPayment);

export default paymentRoutes