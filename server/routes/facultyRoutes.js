import { Router } from "express";
import { addNewFaculty, deleteFaculty, getAllFaculties, getFacultyById, getFacultyStats, updateFaculty } from "../controllers/facultyControllers.js";

const facultyRouter = Router();

facultyRouter.get('/get-all-faculty',getAllFaculties);
facultyRouter.get('/get-faculty-detail/:id',getFacultyById);
facultyRouter.get('/get-faculty-stats',getFacultyStats);
facultyRouter.post('/add-faculty',addNewFaculty);
facultyRouter.delete('/delete-faculty/:id',deleteFaculty);
facultyRouter.put('/update-faculty/:id',updateFaculty);

export default facultyRouter