import express, { NextFunction, Request, Response }  from 'express'
import dotenv from 'dotenv'
import cors from 'cors' 
import { connectionDB } from './config/db.js' 
import userRouter from './router/user.js'

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

  


app.use('/api',userRouter)
connectionDB()


app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
})
app.use((error:Error, req:Request, res:Response, next:NextFunction) => {

    if (error instanceof Error && 'code' in error && error['code'] === 11000) {
        const duplicateError=error as any
        const field = Object.keys(duplicateError.keyValue)[0];
  res.status(400).json({ message: `${field} already exists` });
    }
    else if(error instanceof Error && 'code' in error && error['code'] === 401){
        res.status(401).json({ message: error.message||'internal server error' });
        next();
    }
    else {
        res.status(500).json({ message: error.message||'internal server error' });
        next();
    }
});
 