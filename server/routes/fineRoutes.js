import { Router } from "express";
import { createFine, deleteFine, getAllFines, getFineById, getFineStats, updateFine } from "../controllers/fineControllers.js";

const fineRoutes = Router();

fineRoutes.get('/get-all-fines',getAllFines);
fineRoutes.get('/get-fine-id/:id',getFineById);
fineRoutes.get('/get-fine-stats',getFineStats);
fineRoutes.post('/add-fine',createFine);
fineRoutes.put('/update-fine/:id',updateFine);
fineRoutes.delete('/delete-fine/:id',deleteFine);

export default fineRoutes