import { Router } from "express";
import { addMember, deleteMember, getAllMembers, getMemberDetails, getMemberStats,  } from "../controllers/memberControllers.js";

const memberRouter = Router();

memberRouter.get('/get-all-members',getAllMembers);
memberRouter.get('/get-all-member-stats',getMemberStats);
memberRouter.get('/get-member-details/:member_id',getMemberDetails);
memberRouter.post('/add-member',addMember);
memberRouter.delete('/delete-member/:member_id',deleteMember)

export default memberRouter