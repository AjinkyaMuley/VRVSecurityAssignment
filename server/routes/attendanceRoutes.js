import { Router } from "express";
import { addAttendanceRecord, deleteAttendanceRecord, getAllAttendanceRecords, getAttendanceStats, updateAttendanceRecord } from "../controllers/attendanceControllers.js";

const attendanceRouter = Router();

attendanceRouter.get('/get-all-attendance',getAllAttendanceRecords);
attendanceRouter.get('/get-attendance-stats',getAttendanceStats);
attendanceRouter.post('/add-attendance',addAttendanceRecord);
attendanceRouter.put('/edit-attendance/:id',updateAttendanceRecord);
attendanceRouter.delete('/delete-attendance/:id',deleteAttendanceRecord);

export default attendanceRouter