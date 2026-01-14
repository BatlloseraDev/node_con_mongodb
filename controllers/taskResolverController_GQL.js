import { tasksGet, tasksGetAssignated, createTask } from "./taskController_GQL.js";
import { hasRole_GQL } from "../middlewares/validateRoles.js";



const taskControllerGQL = {
    getTasks: async (_, context) => {
        try {
            hasRole_GQL(context, 'admin', 'standard');
            const tasks = await tasksGet();
            return tasks;
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            throw new Error('Error al obtener tareas');
        }

    },
    getTasksAssignated: async (_, context) => {
        try {
            console.log(context);
            hasRole_GQL(context, 'admin', 'standard');
            const tasks = await tasksGetAssignated();
            return tasks;
        } catch (error) {
            console.error('Error al obtener tareas asignadas:', error);
            throw new Error('Error al obtener tareas asignadas');
        }
    },
    createTask: async (_, {input}, context) => {
        try {
        
            hasRole_GQL(context, 'admin');
            const task = await createTask({input});
            return task;
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw new Error('Error al crear tarea');
        }
    }


}
export default taskControllerGQL;