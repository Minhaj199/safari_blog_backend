import  { Document, Types } from "mongoose"

export interface User{
    firstName:string
    lastName:string
    email:string
    phone:string
    dob:Date
    password:string
    articlePreferences:string
    
}
export type ArticleCategory = 'wildlife' | 'landscape' | 'conservation' | 'culture' | 'adventure';
export interface Article {
    title: string;
    description: string;
    content: string;
    author:{
        id:Types.ObjectId
        name:string
        avatar:string
    }
    publishedAt:Date;
    image:string;
    categories:ArticleCategory[];
    likes:Types.ObjectId[];
    dislikes:Types.ObjectId[];
    blocks:Types.ObjectId[]
  }
export interface userDocument extends Document,User{}
export interface ArticleDocument extends Document,Article{}
