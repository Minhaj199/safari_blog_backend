import { NextFunction, Request, Response } from "express";
import { userModel } from "../model/user.js";
import {  z } from "zod";
import { isAgeBetween18And60 } from "../utilities/ageValidator.js";
import { passwordComparing } from "../utilities/bcrypt.js";
import {  userDocument } from "../types/interfaces.js";
import { createToken } from "../utilities/jwt.js";
import  { Types } from "mongoose";
import { customError } from "../utilities/customeError.js";
import { articleModel } from "../model/article.js";




export const userController = {
  checkEmailExist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error("email not found");
      }
      const isDuplicate = await userModel.findOne({ email: email });
      if (!isDuplicate) {
        res.json({ status: false });
      } else {
        throw new Error("email already exist");
      }
    } catch (error) {
      next(error);
    }
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        dob,
        password,
        confirmPassword,
        articlePreferences,
      } = req.body;

      const registerSchema = z
        .object({
          firstName: z
            .string().trim()
            .min(2, "First name must be at least 2 characters").max(15,'First name must be less than 15 characters'),
          lastName: z
            .string().trim()
            .min(2, "Last name must be at least 2 characters").max(10,"First name must be less than 10 characters"),
          phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
          email: z.string().trim().email("Please enter a valid email address"),
          dob: z.string({
            required_error: "Date of birth is required",
          }),
          password: z
            .string()
            .trim()
            .min(8, "Password must be at least 8 characters")
            .regex(
              /[A-Z]/,
              "Password must contain at least one uppercase letter"
            )
            .regex(
              /[a-z]/,
              "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
          confirmPassword: z.string().trim(),
          articlePreferences: z
            .array(z.string())
            .min(1, "Please select at least one article preference"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        })
        .refine((data) => isAgeBetween18And60(data.dob), {
          message: "age should be 18-60",
          path: ["dob"],
        });
      const validation = registerSchema.safeParse({
        firstName,
        lastName,
        phone,
        email,
        dob,
        password,
        confirmPassword,
        articlePreferences,
      });

      if (validation.success) {
        await userModel.create(validation.data);
        res.json({ status: true });
      } else {
        throw new Error("input data error");
      }
    } catch (error) {
     
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const { identifier, password}=req.body
        const data=z.object({
            identifier: z.string().min(1, "Email or phone is required"),
            password: z.string().min(1, "Password is required"),
          })
          const result=data.safeParse({identifier,password})
          if(result.success){
              const authitcate:userDocument|null=await userModel.findOne({$or:[{phone:identifier},{email:identifier}]})
              
              if(authitcate){
                const isPasswordMatched=await passwordComparing(password,authitcate.password)
                if(isPasswordMatched){
                    const id=(authitcate._id instanceof Types.ObjectId )?authitcate.id:''
                    const token=createToken(id,`${authitcate.firstName} ${authitcate.lastName}`)
                    res.json({status:true,message:'password matched',token:token})
                }else{
                    throw new Error('incorrect password')
                }
              }else{
                throw new Error('user not found')
              }
          }else{
            throw new Error('validatation failed')
          }
          

    } catch (error) {
        next(error)
    }
  },
  creatArticle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userID=req.userID
      if(!userID||typeof userID!=='string'){
        throw customError('user id not found',401)
      }
     const {
        categories,
        content,
        description,
        titile:title
      }=req.body
        const data=await articleModel.create({
          title,
          categories,
          description,
          content,
          author:{
           id:new Types.ObjectId(userID),
           name:req.userName
          }
        })
        if(data){

          res.json({status:true})
        }else{
          throw new Error('error on article creation')
        }
    } catch (error) {
      console.log(error)
      next(error)      
    }
  },  
  fetchcategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userID=req.userID
      if(!userID&&typeof userID!=='string'){
        throw customError('authentiacation failed',401)
      }
     const preference=await userModel.findOne({_id:userID},{_id:0,articlePreferences:1}).lean()
     if(preference){
      res.json({preference:Object.values(preference).flat()})
     }else{
      res.json({preference:[]})
     }
    } catch (error) {
     next(error)
    }
  }, 
  getArticle:async(req:Request,res:Response,next:NextFunction)=>{
  try {
   const userID=req.userID
   if(!userID&&typeof userID!=='string'){
    throw customError('',401)
   } 
   let data=await articleModel.find({blocks:{$nin:[new Types.ObjectId(userID)]}}).lean()
    data=data.map(elem=>{
    let liked=elem.likes.some((id)=>id.equals(new Types.ObjectId(userID)))
    let disliked =elem.dislikes.some((id)=>id.equals(new Types.ObjectId(userID)))
    if(liked){
      return {...elem,reactionStusut:'liked'}
    }else if(disliked){

      return {...elem,reactionStusut:'disliked'}
    }else{
      return {...elem,reactionStatus:'no reaction'}
    }
    })
   res.json(data)
  } catch (error) {
    next(error)
  }
  },
  interactions:async(req:Request,res:Response,next:NextFunction)=>{
    try {
     const userID=req.userID
     if(!userID&&typeof userID!=='string'){
      throw customError('',401)
     } 
     const articleId=req.params.id
     if(!articleId&&typeof articleId !=='string')throw new Error('article id not found')
    const {action,toggle=true}=req.body
    
  const validActions = ['liked', 'disliked', 'blocked'];
  if(!validActions.includes(action)){
    throw new Error('invalid action')
  }
  const article=await articleModel.findById(articleId) 
  if(!article){
    throw new Error('article not fount')
  }
  article.likes = article.likes.filter(id => id.toString() !== userID);
  article.dislikes = article.dislikes.filter(id => id.toString() !== userID);
  article.blocks = article.blocks.filter(id => id.toString() !== userID);
  const id=new Types.ObjectId(userID)
 
  if(!toggle){
  
      // Apply new interaction
     
      if (action === 'liked') article.likes.push(id);
      else if (action === 'disliked') article.dislikes.push(id);
      else if (action === 'blocked') article.blocks.push(id);

  }
 
    await article.save();
 
  res.json({status:'good'})   
} catch (error) {
  console.log(error)
      next(error)
    }
    }
  
};
