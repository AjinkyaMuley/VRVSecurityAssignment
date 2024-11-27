import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import streamRoutes from './routes/streamRoutes.js'
import admissionRouter from './routes/admissonRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import facultyRouter from './routes/facultyRoutes.js'
import newsRouter from './routes/newsRoutes.js'
import bookIssueRouter from './routes/bookIssueRoutes.js'
import sliderRoutes from './routes/sliderRoutes.js'
import fineRoutes from './routes/fineRoutes.js'
import inventoryRoutes from './routes/inventroryRoutes.js'
import memberRouter from './routes/memberRoutes.js'
import attendanceRouter from './routes/attendanceRoutes.js'
import gradeRouter from './routes/gradeRoutes.js'
import loginRouter from './routes/authRoutes.js'

dotenv.config()
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended : true}));

app.use('/api/stream',streamRoutes);
app.use('/api/admissions',admissionRouter);
app.use('/api/payment',paymentRoutes);
app.use('/api/student',studentRoutes);
app.use('/api/faculty',facultyRouter);
app.use('/api/news',newsRouter);
app.use('/api/bookissues',bookIssueRouter);
app.use('/api/sliders',sliderRoutes);
app.use('/api/fines',fineRoutes);
app.use('/api/books',inventoryRoutes);
app.use('/api/members',memberRouter);
app.use('/api/attendance',attendanceRouter);
app.use('/api/grades',gradeRouter);
app.use('/api/auth',loginRouter);

app.listen(process.env.PORT,() => {
    console.log("Server running on PORT " + process.env.PORT);
})