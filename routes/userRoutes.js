import { Router } from "express";
import controlador from '../controllers/userController.js';
export const router = Router();

// Ejemplo import middelwares: import {esMayor, otroMiddleware} from "../middlewares/userMiddlewares.js";

//router.get('/',[/*middlewares */],/*controlador.getUsers*/);
router.post('/login', controlador.login);
router.post('/register', controlador.register); //-> create

//CRUD, TO DO: MIDDLEWARES
router.get('/', controlador.getUsers);
router.get('/:id', controlador.getUser);
router.put('/:id', controlador.updateUser);
router.delete('/:id', controlador.deleteUser);

