import express from 'express'
import { getUserController } from "../controllers/userController"
import { auth } from '../middleware/auth';
const userRoutes = express.Router()

userRoutes.get('/user', auth,getUserController);


export { userRoutes };