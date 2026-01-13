import { Router } from "express";
import controlador from '../controllers/userController.js';
export const router = Router();
import { isAdmin, isStandard } from "../middlewares/validateRoles.js";
// Ejemplo import middelwares: import {esMayor, otroMiddleware} from "../middlewares/userMiddlewares.js";

//router.get('/',[/*middlewares */],/*controlador.getUsers*/);
router.post('/login', controlador.login);
router.post('/register', controlador.register); //-> create


router.get('/',isAdmin,  controlador.getUsers);
router.get('/:id', [isAdmin, isStandard], controlador.getUser);
router.put('/:id',[isAdmin, isStandard], controlador.updateUser);
router.delete('/:id', isAdmin, controlador.deleteUser);

