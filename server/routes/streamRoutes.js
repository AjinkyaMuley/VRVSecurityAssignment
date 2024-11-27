import { Router } from "express";
import { addNewStream, deleteStream, getAllStreamData, getStreamStats, updateStream } from "../controllers/streamControllers.js";

const streamRoutes = Router();

streamRoutes.get('/get-stream-stats',getStreamStats);
streamRoutes.get('/get-all-stream-data',getAllStreamData)
streamRoutes.post('/add-a-stream',addNewStream);
streamRoutes.post('/update-stream/:id',updateStream);
streamRoutes.delete('/delete-stream/:id',deleteStream);

export default streamRoutes