import { Router } from "express";
import { addNews, approveNews, deleteNews, editNews, getAllNews, getNewsById, getNewsStats } from "../controllers/newsControllers.js";

const newsRouter = Router();

newsRouter.get('/get-all-news',getAllNews);
newsRouter.get('/get-all-news-id/:id',getNewsById);
newsRouter.get('/get-news-stats/',getNewsStats);
newsRouter.post('/add-news',addNews);
newsRouter.put('/update-news/:id',editNews);
newsRouter.delete('/delete-news/:id',deleteNews);
newsRouter.put('/approve-news/:id',approveNews)

export default newsRouter