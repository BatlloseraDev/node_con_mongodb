import { tasksGet , tasksGetAssignated} from "./taskController_GQL";
import { hasRole_GQL } from "../middlewares/validateRoles";



const taskController_GQL = {
    getTasks: async(_, context) =>{
        try{
            hasRole_GQL(context, 'admin', 'standard');
            const tasks = await tasksGet();
            return tasks;
        }catch(error){
            console.error('Error al obtener tareas:', error);
            throw new Error('Error al obtener tareas');
        }
    
    },
    getTasksAssignated: async(_, context) =>{
        try{
            hasRole_GQL(context, 'admin', 'standard');
            const tasks = await tasksGetAssignated();
            return tasks;
        }catch(error){
            console.error('Error al obtener tareas asignadas:', error);
            throw new Error('Error al obtener tareas asignadas');
        }
    }
    


}