import { Router } from "express";
import controlador from '../controllers/userController.js';
export const router = Router();
import { validateJWT } from "../middlewares/ValidateJWT.js";
import { hasRole } from "../middlewares/validateRoles.js";

// import { isAdmin, isStandard } from "../middlewares/validateRoles.js";
// Ejemplo import middelwares: import {esMayor, otroMiddleware} from "../middlewares/userMiddlewares.js";

//router.get('/',[/*middlewares */],/*controlador.getUsers*/);
router.post('/login', controlador.login);
router.post('/register', controlador.register); //-> create


router.get('/',[validateJWT,hasRole('admin')],  controlador.getUsers);
router.get('/:id', [validateJWT,hasRole('admin', 'standard')], controlador.getUser);
router.put('/:id',[validateJWT,hasRole('admin', 'standard')], controlador.updateUser);
router.delete('/:id', [validateJWT,hasRole('admin')], controlador.deleteUser);
router.post('/populate/:n', [validateJWT,hasRole('admin')], controlador.populateUsers);



