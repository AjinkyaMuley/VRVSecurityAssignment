import { Router } from "express";
import { createStudent, deleteStudent, getAllStudents, getStudent, getStudentStats, updateStudent } from "../controllers/studentControllers.js";

const studentRoutes = Router();

studentRoutes.get('/get-all-students',getAllStudents);
studentRoutes.get('/get-student-stats',getStudentStats);
studentRoutes.get('/get-student-by-id/:id',getStudent);
studentRoutes.post('/add-student',createStudent);
studentRoutes.put('/update-student/:id',updateStudent);
studentRoutes.delete('/delete-student/:id',deleteStudent);

export default studentRoutes