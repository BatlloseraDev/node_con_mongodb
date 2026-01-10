import { Router } from "express";
import controlador from '../controllers/taskController.js';
export const router = Router();

// Ejemplo import middelwares: import {esMayor, otroMiddleware} from "../middlewares/userMiddlewares.js";

//router.get('/',[/*middlewares */],/*controlador.getTasks*/);