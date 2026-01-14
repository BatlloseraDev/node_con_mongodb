// import {usuariosGet, usuarioGet, usuariosPost, usuariosPut, usuariosDelete} from '../controllers/userController_GQL.js';
// import {addComentario, comentariosGet, comentariosGetAsignados, comentarioGetAsignadoA} from '../controllers/commentsController_GQL.js';

import taskControllerGQL from "../controllers/taskResolverController_GQL.js";


const resolvers = {
    Query: {
        getTask: taskControllerGQL.getTask,
        getTasks: taskControllerGQL.getTasks,
        getTasksAssignated: taskControllerGQL.getTasksAssignated
    },
    Mutation:{
        createTask: taskControllerGQL.createTask,
        updateTask: taskControllerGQL.updateTask,
        changeTaskStatus: taskControllerGQL.changeTaskStatus,
        deleteTask: taskControllerGQL.deleteTask
    },

}

export default resolvers;