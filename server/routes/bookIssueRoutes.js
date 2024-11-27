import { Router } from "express";
import { addNewBookIssue, editBookIssue, getAllIssuedBooks, getBookIssueDetails, getBookIssueStats } from "../controllers/bookIssueControllers.js";

const bookIssueRouter = Router();

bookIssueRouter.post('/add-new-issue',addNewBookIssue);
bookIssueRouter.put('/edit-book-issue/:issue_id',editBookIssue);
bookIssueRouter.get('/get-issue-detail/:issue_id',getBookIssueDetails);
bookIssueRouter.get('/get-all-issues',getAllIssuedBooks);
bookIssueRouter.get('/get-issue-stats',getBookIssueStats);

export default bookIssueRouter