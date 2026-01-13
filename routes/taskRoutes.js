import { Router } from "express";
import controlador from '../controllers/taskController.js';
export const router = Router();
import { validateJWT } from "../middlewares/ValidateJWT.js";
import { hasRole } from "../middlewares/validateRoles.js";

// Ejemplo import middelwares: import {esMayor, otroMiddleware} from "../middlewares/userMiddlewares.js";

//router.get('/',[/*middlewares */],/*controlador.getTasks*/);


//admin -> crear, editar, asignar y eliminar
//standard-> consultar, modificar estado (por hacer...etc)


/*
//Esto lo voy a dejar asi sin acabar porque voy a tratar de implementarlo en graphql
router.get('/',[validateJWT,hasRole('admin', 'standard')],  controlador.getTasks);//-> ver tareas
router.post('/', [validateJWT,hasRole('admin')], controlador.createTask);//-> crear tarea
router.put('/:id',[validateJWT,hasRole('admin')], controlador.updateTask);//-> editar tarea
router.delete('/:id', [validateJWT,hasRole('admin')], controlador.deleteTask);//-> eliminar tarea
router.put('/asignar/:id/:idU',[validateJWT,hasRole('admin')], controlador.assignTaskToUser);//-> asignar tarea a usuario
router.put('/modificarEstado/:id',[validateJWT,hasRole('admin,standard')], controlador.modifyTaskStatus);//-> modificar estado de tarea
*/


