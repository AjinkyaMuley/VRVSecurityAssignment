import {Router} from 'express'
import { createAccount, login, sigin, updateAdminStatus } from '../controllers/loginControllers.js';
const loginRouter = Router();

loginRouter.post('/login',login)
loginRouter.post('/signin',sigin)
loginRouter.post('/update-status',updateAdminStatus)
loginRouter.post('/create-account',createAccount)
export default loginRouter
