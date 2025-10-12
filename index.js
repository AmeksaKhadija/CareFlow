import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb+srv://ameksa_khadija:kKvsvuALWS1pu2sw@cluster0.pubiuhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.mongoose.connect(uri).then(() => {
    console.log("DATABASE CONNECETED");
}).catch((error) => {
    console.log(error);
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
    res.json({ message: 'CareFlow API is running' });
});

app.listen(process.env.PORT, () => {
    console.log("listning.....");
});