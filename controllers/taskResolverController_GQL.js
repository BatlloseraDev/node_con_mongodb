import { taskGet, tasksGet, tasksGetAssignated, createTask, updateTask, changeTaskStatus, deleteTask, asignateTask, getUserTasks, releaseTask, takeTask } from "./taskController_GQL.js";
import { hasRole_GQL } from "../middlewares/validateRoles.js";



const taskControllerGQL = {
    //query
    getTasks: async (_, args, context) => {
        try {
            hasRole_GQL(context, 'admin', 'standard');
            const tasks = await tasksGet();
            return tasks;
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            throw new Error('Error al obtener tareas');
        }

    },
    getTasksAssignated: async (_, args ,context) => {
        try {
           
            hasRole_GQL(context, 'admin', 'standard');
            const tasks = await tasksGetAssignated();
            return tasks;
        } catch (error) {
            console.error('Error al obtener tareas asignadas:', error);
            throw new Error('Error al obtener tareas asignadas');
        }
    },
    getTask: async (_, {id}, context) => {
        try {
            hasRole_GQL(context, 'admin', 'standard');
            const task = await taskGet(id);
            return task;
        } catch (error) {
            console.error('Error al obtener tarea:', error);
            throw new Error('Error al obtener tarea');
        }
    },
    getUserTasks: async (_, {idU}, context) => {
        try {
            hasRole_GQL(context, 'admin', 'standard');
            const tasks = await getUserTasks(idU);
            const userTasks = tasks.filter(task => task.idU === idU);
            return userTasks;
        } catch (error) {
            console.error('Error al obtener tareas del usuario:', error);
            throw new Error('Error al obtener tareas del usuario');
        }
    },
    //mutations
    createTask: async (_, {input}, context) => {
        try {
        
            hasRole_GQL(context, 'admin');
            const task = await createTask({input});
            return task;
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw new Error('Error al crear tarea');
        }
    },
    updateTask: async (_, {id, input}, context) => {
        try {
            hasRole_GQL(context, 'admin');
            const task = await updateTask({id, input});
            return task;
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            throw new Error('Error al actualizar tarea');
        }

    },//update completo
    changeTaskStatus: async (_, {id, status}, context) => {
        try {
            hasRole_GQL(context, 'admin', 'standard');
            const task = await changeTaskStatus({id, status});
            return task;
        } catch (error) {
            console.error('Error al cambiar el estado de la tarea:', error);
            throw new Error('Error al cambiar el estado de la tarea');
        }
    },
    deleteTask: async (_, {id}, context) => {
        try {
            hasRole_GQL(context, 'admin');
            const task = await deleteTask({id});
            return task;
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            throw new Error('Error al eliminar la tarea');
        }
    },
    asignateTask: async (_, {id, idU}, context) => {
        try {
            hasRole_GQL(context, 'admin');
            const task = await asignateTask({id, idU});
            return task;
        } catch (error) {
            console.error('Error al asignar tarea:', error);
            throw new Error('Error al asignar tarea');
        }
    },
    releaseTask: async (_, {id}, context) => {
        try {
            hasRole_GQL(context, 'admin', 'standard');
            const task = await releaseTask({id},context.user.id);
            return task;
        } catch (error) {
            console.error('Error al liberar tarea:', error);
            throw new Error('Error al liberar tarea');
        }   
    },
    takeTask: async (_, {id}, context) => {
        try {
            hasRole_GQL(context, 'admin', 'standard');
            const task = await takeTask({id},context.user.id);
            return task;
        } catch (error) {
            console.error('Error al tomar tarea:', error);
            throw new Error('Error al tomar tarea');
        }   
    },

     


}
export default taskControllerGQL;