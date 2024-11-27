import { Router } from "express";
import { addGrade, deleteGrade, getAcademicStats, getAllGrades, updateGrade } from "../controllers/gradeControllers.js";

const gradeRouter = Router();

gradeRouter.get('/get-all-grades',getAllGrades);
gradeRouter.get('/get-grade-stats',getAcademicStats);
gradeRouter.post('/add-grade',addGrade);
gradeRouter.put('/edit-grade/:id',updateGrade);
gradeRouter.delete('/delete-grade/:id',deleteGrade);

export default gradeRouter