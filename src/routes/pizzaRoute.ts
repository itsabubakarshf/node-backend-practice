import express from 'express'
import {createPizzaController,getAllPizzaController} from "../controllers/pizzaController"
import { auth } from '../middleware/auth';

const pizzaRoutes=express.Router()

pizzaRoutes.post('/pizza',auth, createPizzaController);
pizzaRoutes.get('/pizza',auth,getAllPizzaController);

export { pizzaRoutes };
