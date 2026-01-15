//consultas GraphQL 
import User from "../models/UserMongo.js";
import Task from "../models/TaskMongo.js";


export const tasksGet = async () => {
    try {
        const tasks = await Task.find();
        if (tasks.length > 0) {
            console.log(tasks)
            console.log('Listado correcto!');
            return (tasks);
        }
        else {
            throw new Error("No hay registros.");
        }

    } catch (error) {
        console.error('Error al obtener tareas:', error);
        throw new Error('Error al obtener tareas');

    }
}

//tareas asignadas con lookup
export const tasksGetAssignated = async () => {
    try {
        const tasks = await Task.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'idU',
                    foreignField: 'id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]);
        if (tasks.length > 0) {
            console.log(tasks)
            console.log('Listado correcto!');
            return (tasks);
        }
        else {
            throw new Error("No hay registros.");
        }

    } catch (error) {
        console.error('Error al obtener tareas asignadas:', error);
        throw new Error('Error al obtener tareas asignadas');
    }
}

export const taskGet = async (id) => {
    try {
        const task = await Task.findOne({ id: id });
        if (task != null) {
            console.log('Tarea encontrada!');
            return task
        } else {
            throw new Error("Tarea no encontrada!");
        }
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        throw new Error('Error al obtener tarea');
    }
}


//mutations

export const createTask = async ({ input }) => {
    try {
        const newTask = new Task({
            id: await Task.countDocuments() + 1,
            description: input.description,
            duration: input.duration,
            difficulty: input.difficulty,
        });//por defecto es por hacer y no es asignado a nadie al crearse
        return await newTask.save();
    }
    catch (error) {
        console.error('Error al crear tarea:', error);
        throw new Error('Error al crear tarea');
    }

}
export const updateTask = async ({ id, input }) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { id: id },
            input,
            { new: true })
        if (updatedTask) {
            console.log('Tarea actualizada correctamente!');
            //despues de actualizarla la populo con lookup
            const result = await Task.aggregate([
                {
                    $match: { id: id }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'idU',
                        foreignField: 'id',
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                        //por lo que he investigado esto te lo devuelve aunque sea null
                    }
                }

            ]);
            console.log("Tarea actualizada y populada correctamente!")
            return result[0];
        } else {
            throw new Error('Tarea no encontrada!', error);
        }

    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        throw new Error('Error al actualizar tarea');
    }
}

export const changeTaskStatus = async ({ id, status }) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { id: id },
            { status: status },
            { new: true }
        );
        if (updatedTask) {
            console.log('Estado de la tarea actualizado correctamente!');
            return updatedTask;
        } else {
            throw new Error('Tarea no encontrada!');
        }
    } catch (error) {
        console.error('Error al cambiar el estado de la tarea:', error);
        throw new Error('Error al cambiar el estado de la tarea');
    }
}

export const deleteTask = async ({ id }) => {
    try {
        const deletedTask = await Task.deleteOne({ id: id });
        if (deletedTask.deletedCount > 0) {
            console.log('¡Tarea eliminada correctamente!');
            return { id: id }; // Devolver un objeto con el ID de la tarea eliminada
        } else {
            throw new Error('Tarea no encontrada!');
        }
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        throw new Error('Error al eliminar la tarea');
    }
}


//Asignar Tarea a alguien
export const asignateTask = async ({id, idU}) =>{
    try{
        //comprobar si el usuario que se intentaAsignar existe
        const user = await User.findOne({id: idU});
        if(!user){
            throw new Error('¡Usuario no encontrado!');
        }
        const updatedTask = await Task.findOneAndUpdate(
            {id: id},
            {idU: idU},
            {new: true}
        );
        if(updatedTask){
            console.log('Tarea asignada correctamente!');
            return updatedTask;
        }else{
            throw new Error('Tarea no encontrada!');
        }
    }catch(error){
        console.error('Error al asignar tarea:', error);
        throw new Error('Error al asignar tarea');
    }
}



//Ejemplo:

/*

export const usuariosGet = async () => {
    try {
        const personas = await UserModel.find();
        if (personas.length > 0) {
            console.log(personas)
            console.log('Listado correcto!');
            return (personas);
        } else {
            throw new Error("No hay registros.");
            //console.log('No hay registros!');
            //return null;
        }
    } catch (error) {
        throw new Error('Error al obtener usuarios:', error);
        // console.error('Error al obtener usuarios:', error);
        // return null
    }
};


export const usuarioGet = async (pid) => {

    try {
        const usuario = await UserModel.findOne({"id": pid});
        console.log(usuario);
        if (usuario != null)  {
            console.log('Usuario encontrado!');
            return usuario
        } else {
            throw new Error("Usuario no encontrado!");
            // console.log('Usuario no encontrado!');
            // return null
        }
    } catch (error) {
        throw new Error('Error al obtener usuario por ID:', error);
        // console.error('Error al obtener usuario por ID:', error);
        // return null
    }
}

export const usuariosPost = async (pers) => {

    try {
        const encontrado = await UserModel.findOne({ "id": pers.id });
        if (encontrado) {
            throw new Error("Usuario ya existe!");
        }
        
        const usuario = await UserModel.create(pers);
        console.log('Usuario registrado correctamente!', usuario);
        return usuario;
    
    } catch (error) {
        if (error.message === "Usuario ya existe!") {
            throw new Error("El usuario ya está registrado en la base de datos.");
        } else if (error.name === "ValidationError") {
            throw new Error("Datos inválidos para registrar usuario.");
        } else {
            throw new Error("Error inesperado al registrar usuario.");
        }
    }
    
}

export const usuariosPut = async (id, pers) => {

    try {
        const usuarioActualizado = await UserModel.updateOne({id : id}, pers, { new: true }); //Con la opción new, se devuelve el objeto acualizado, en caos contrario el original.
        //const usuarioActualizado = await UserModel.updateMany({id : id}, pers);
        console.log(usuarioActualizado.matchedCount)
        console.log(pers)
        if (usuarioActualizado.matchedCount > 0) {
            console.log('Usuario actualizado correctamente!');
            return pers
        } else {
            throw new Error('Usuario no encontrado!', error);
            // console.log('Usuario no encontrado!');
            // return 0;
        }
    } catch (error) {
        throw new Error('Error al actualizar usuario!', error);
        // console.error('Error al actualizar usuario:', error);
        // return -1
    }
};


export const usuariosDelete = async (pid) => {

    try {
        //const usuarioEliminado = await UserModel.deleteOne({"id": pid});
        const usuarioEliminado = await UserModel.deleteMany({"id": pid});
        if (usuarioEliminado.deletedCount > 0) {
            console.log('Usuario eliminado correctamente!');
            return true;
        } else {
            throw new Error('Usuario no encontrado!', error);
            // console.log('Usuario no encontrado!');
            // return false
        }
    } catch (error) {
        throw new Error('Error al eliminar usuario!', error);
        // console.error('Error al eliminar usuario:', error);
        // return false
    }
};


*/