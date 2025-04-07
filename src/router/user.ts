import { Router } from "express";
import { userController } from "../controller/controller.js";  
import { upload } from "../utilities/multer.js";
import { userAuth } from "../middleware/userAuth.js";

const userRouter=Router()


userRouter.post('/duplicatechacking',userController.checkEmailExist)
userRouter.post('/register',userController.register)
userRouter.post('/login',userController.login)
userRouter.post('/create_article',userAuth,upload.single('file'),userController.creatArticle)
userRouter.get('/user_preference',userAuth,userController.fetchcategory)
userRouter.get('/get_article',userAuth,userController.getArticle)
userRouter.patch('/interactions/:id',userAuth,userController.interactions)

export default userRouter