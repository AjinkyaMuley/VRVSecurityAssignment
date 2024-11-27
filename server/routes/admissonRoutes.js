import { Router } from "express";
import { addNewAdmissions, approveAdmission, getAdmissionDetail, getAllAdmissions, getAllStats, rejectAdmission } from "../controllers/admissionControllers.js";

const admissionRouter = Router();

admissionRouter.get('/get-all-admissions',getAllAdmissions);
admissionRouter.post('/add-new-admission',addNewAdmissions);
admissionRouter.get('/get-admission-detail/:id',getAdmissionDetail);
admissionRouter.put('/approve-admission/:id',approveAdmission);
admissionRouter.put('/reject-admission/:id',rejectAdmission);
admissionRouter.get('/get-all-stats',getAllStats);

export default admissionRouter