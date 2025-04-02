import express, { NextFunction, Request, Response }  from 'express'
import dotenv from 'dotenv'
import cors from 'cors' 
import { connectionDB } from './config/db.js' 
dotenv.config()

const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    exposedHeaders: ['authorizationforuser'],
};
const app=express()

app.use(cors(corsOptions));
app.use(express.urlencoded());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('recieved')
})

connectionDB()


app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
})
app.use((error:Error, req:Request, res:Response, next:NextFunction) => {
    console.log(error);
    if (error instanceof Error && 'code' in error && error['code'] === 11000) {
        res.status(400).json({ message: 'email already exist' });
    }
    else {
        res.status(500).json({ error: 'internal server error' });
        next();
    }
});
