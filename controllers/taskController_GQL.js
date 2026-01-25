//consultas GraphQL 
import User from "../models/UserMongo.js";
import Task from "../models/TaskMongo.js";

const difficultyMap = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5
};// para el filtro

const notifyUpdate = (io) => {
    console.log(io)
    if (io) {
        io.emit('server:tasks-update', { msg: 'Lista actualizado' });
        console.log('Evento socket emitido: server:task-update')
    }
}

const clearCache = async (redisClient) => {
    if (!redisClient) {
        console.log("Problema limpiando la cache")
        return;
    }
    try {
        const keys = await redisClient.keys('tasks:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log("He limpiado la caché en redis");
        }
    } catch (error) {
        console.error('Error limpiando la cache en redis: ' + error);
    }
}



export const tasksGet = async ({ filter }, redisClient) => {
    try {
        const cacheKey = filter ? `tasks:${JSON.stringify(filter)}` : 'tasks:all';
        //honestamente esto me ha quedado raro debido al tema del filtro
        //creo que se puede mejorar
        if (redisClient) {
            const cacheData = await redisClient.get(cacheKey);
            if (cacheData) {
                console.log('He cargado las tareas desde redis');
                return JSON.parse(cacheData);
            }
        }


        if (!filter) {
            const tasks = await Task.find();
            if (tasks.length > 0) {
                console.log(tasks)
                console.log('Listado correcto!');
                if (redisClient) {
                    await redisClient.setEx(cacheKey, 60, JSON.stringify(tasks));
                    console.log("He guardado en cache las tareas durante 60 s")
                }
                return (tasks);
            }
            else {
                throw new Error("No hay registros.");
            }
        }// en caso de que venga sin filtros 

        let matchStage = {};

        //filtrado por dificultad exacta

        if (filter.difficulty) {
            matchStage.difficulty = filter.difficulty;
        }

        //filtrado por dificultad en rango
        if (filter.minDifficulty || filter.maxDifficulty) {
            const minVal = difficultyMap[filter.minDifficulty] || 0;
            const maxVal = difficultyMap[filter.maxDifficulty] || 10; //como no hay mas es mas que suficiente

            //tras muchos fallos y errores al final pregunte a la ia como hacer esto que quería hacer por eso el tema de object 
            const allowedDifficulties = Object.keys(difficultyMap).filter(key => {
                const val = difficultyMap[key];
                return val >= minVal && val <= maxVal;
            });
            matchStage.difficulty = { $in: allowedDifficulties };
        }
        //filtrado por persona
        if (filter.assignedTo) {
            matchStage.idU = Number(filter.assignedTo);
        }
        //filtrado por tarea sin asignar
        if (filter.isUnassigned === true) { //el igual a true es por que compueba si existe no su valor 
            matchStage.idU = null;
        }


        //en esta parte construyo la query
        const pipeline = [
            //  Filtrado $match equivale a .find(query) 
            {
                $match: matchStage
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
                }
            }
        ];

        //ordenación
        if (filter.sortBy && filter.sortBy === 'duration_difficulty') {
            pipeline.push({
                $sort: { duration: 1, difficulty: 1 }
            });
        }
        const result = await Task.aggregate(pipeline);

        if (redisClient && result.length > 0) {
            await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
            console.log("He guardado en cache las tareas durante 60 s")
        }

        console.log("Tareas cargadas correctamente")
        return result;

    } catch (error) {
        console.error('Error al obtener tareas:', error);
        throw new Error('Error al obtener tareas');

    }
}

//tareas asignadas con lookup
export const tasksGetAssignated = async (redisClient) => {
    try {
        const cacheKey = 'tasks:assignated'

        if (redisClient) {
            const cacheData = await redisClient.get(cacheKey);
            if (cacheData) {
                console.log('He cargado las tareas desde redis');
                return JSON.parse(cacheData);
            }
        }//podría sacarlo en un metodo ya que lo repito todo el rato

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
            if(redisClient){
                await redisClient.setEx(cacheKey, 60, JSON.stringify(tasks));
                console.log("He guardado en cache las tareas asignadas durante 60 s")
            }
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

export const taskGet = async (id, redisClient) => {
    try {
        const cacheKey = `tasks:${id}`;
        if (redisClient) {
            const cacheData = await redisClient.get(cacheKey);
            if (cacheData) {
                console.log('He cargado la tarea desde redis');
                return JSON.parse(cacheData);
            }
        }



        const task = await Task.findOne({ id: id });
        if (task != null) {
            console.log('Tarea encontrada!');
            if (redisClient) {
                await redisClient.setEx(cacheKey, 60, JSON.stringify(task));
                console.log("He guardado en cache la tarea durante 60 s")
            }
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

export const createTask = async ({ input }, io, redisClient) => {
    try {
        const newTask = new Task({
            id: await Task.countDocuments() + 1,
            description: input.description,
            duration: input.duration,
            difficulty: input.difficulty,
        });//por defecto es por hacer y no es asignado a nadie al crearse
        const saved = await newTask.save()
        notifyUpdate(io);
        await clearCache(redisClient);
        return saved
    }
    catch (error) {
        console.error('Error al crear tarea:', error);
        throw new Error('Error al crear tarea');
    }

}
export const updateTask = async ({ id, input }, redisClient) => {
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
            await clearCache(redisClient);
            return result[0];
        } else {
            throw new Error('Tarea no encontrada!', error);
        }

    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        throw new Error('Error al actualizar tarea');
    }
}

export const changeTaskStatus = async ({ id, status }, idU, roles, redisClient) => {
    try {
        const requiredTask = await Task.findOne(
            { id: id }
        );
        //controlar que exista
        if (!requiredTask) {
            throw new Error('Tarea no encontrada!');
        }
        //controlar que si el usuario que la actualiza es admin o es el usuario asignado a la tarea
        if (!roles.some(rol => rol.name === 'admin') && requiredTask.idU !== idU) {
            throw new Error('No tienes permiso para cambiar el estado de esta tarea!');
        }
        //controlar que el nuevo estado sea correcto(para no hacer saltos 'por hacer'->'haciendo'->'hecho') solo si es un usuario standard y no admin
        if (roles.some(rol => rol.name === 'standard') && !roles.some(rol => rol.name === 'admin')) {
            const validTransitions = {
                'por hacer': 'haciendo',
                'haciendo': 'hecha'
            };
            const currentStatus = requiredTask.status;
            const newStatus = status;
            if (!validTransitions[currentStatus] || validTransitions[currentStatus] !== newStatus) {
                throw new Error(`Transición de estado inválida de '${currentStatus}' a '${newStatus}'`);
            }
        }
        //actualizarla
        const updatedTask = await Task.findOneAndUpdate(
            { id: id },
            { status: status },
            { new: true }
        );

        if (updatedTask) {
            console.log('Estado de la tarea actualizado correctamente!');
            await clearCache(redisClient);
            return updatedTask;
        } else {
            throw new Error('Tarea no encontrada!');
        }
    } catch (error) {
        console.error('Error al cambiar el estado de la tarea:', error);
        throw new Error('Error al cambiar el estado de la tarea');
    }
}

export const deleteTask = async ({ id }, io, redisClient) => {
    try {
        const deletedTask = await Task.deleteOne({ id: id });
        if (deletedTask.deletedCount > 0) {
            console.log('¡Tarea eliminada correctamente!');
            notifyUpdate(io)
            await clearCache(redisClient);
            return { id: id }; // Devolver un objeto con el ID de la tarea eliminada
        } else {
            throw new Error('Tarea no encontrada!');
        }
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        throw new Error('Error al eliminar la tarea');
    }
}


//Asignar Tarea a alguien como admin
export const asignateTask = async ({ id, idU }, io, redisClient) => {
    try {
        //comprobar si el usuario que se intentaAsignar existe
        const user = await User.findOne({ id: idU });
        if (!user) {
            throw new Error('¡Usuario no encontrado!');
        }
        const updatedTask = await Task.findOneAndUpdate(
            { id: id },
            { idU: idU },
            { new: true }
        );
        if (updatedTask) {
            console.log('Tarea asignada correctamente!');
            notifyUpdate(io);
            await clearCache(redisClient);
            return updatedTask;
        } else {
            throw new Error('Tarea no encontrada!');
        }
    } catch (error) {
        console.error('Error al asignar tarea:', error);
        throw new Error('Error al asignar tarea');
    }
}

export const getUserTasks = async (idU, redisClient) => {
    try {
        const cacheKey = `tasks:user:${idU}`;
        if(redisClient){
            const cacheData = await redisClient.get(cacheKey);
            if (cacheData) {
                console.log('He cargado las tareas del usuario desde redis');
                return JSON.parse(cacheData);
            }
        }

        const tasks = await Task.find({ idU: idU });
        if (tasks.length > 0) {
            console.log(tasks);
            console.log('Listado correcto!');
            if(redisClient){
                await redisClient.setEx(cacheKey, 60, JSON.stringify(tasks));
                console.log("He guardado en cache las tareas del usuario durante 60 s")
            }
            return (tasks);
        } else {
            throw new Error("No hay registros.");
        }
    } catch (error) {
        console.error('Error al obtener tareas del usuario:', error);
        throw new Error('Error al obtener tareas del usuario');
    }
}

export const releaseTask = async ({ id }, idU, io) => {
    try {
        //comprobar que el idU es el mismo que tiene la tarea
        const task = await Task.findOne({ id: id });
        if (task.idU !== idU) {
            throw new Error('¡No tienes permiso para liberar esta tarea!');
        }
        //en caso afirmativo liberar la tarea
        const updatedTask = await Task.findOneAndUpdate(
            { id: id },
            { idU: null },
            { new: true }
        );
        if (updatedTask) {
            console.log('Tarea liberada correctamente!');
            notifyUpdate(io);
            return updatedTask;
        } else {
            throw new Error('Tarea no encontrada!');
        }
    } catch (error) {
        console.error('Error al liberar tarea:', error);
        throw new Error('Error al liberar tarea');
    }
}

export const takeTask = async ({ id }, idU, io, redisClient) => { //como usuario normal solo puedo asignar la tarea si no la tiene nadie asignada
    try {
        //comprobar que la tarea tiene el idU a null
        const task = await Task.findOne({ id: id });
        if (task.idU !== null) {
            throw new Error('¡La tarea ya está asignada!');
        }
        //en caso afirmativo asignar la tarea
        const updatedTask = await Task.findOneAndUpdate(
            { id: id },
            { idU: idU },
            { new: true }
        );
        if (updatedTask) {
            console.log('Tarea asignada correctamente! Llamando a al web-socket');
            notifyUpdate(io)
            await clearCache(redisClient);
            return updatedTask;
        } else {
            throw new Error('Tarea no encontrada!');
        }
    } catch (error) {
        console.error('Error al asignar tarea:', error);
        throw new Error('Error al asignar tarea');
    }
}

export const getTaskCount = async ({ filter }, redisClient) => { //TODO guardar en cache
    try {
        const cacheKey = `tasks:count:${JSON.stringify(filter)}`;
        if (redisClient) {
            const cacheData = await redisClient.get(cacheKey);
            if (cacheData) {
                console.log('He cargado el conteo de tareas desde redis');
                return JSON.parse(cacheData);
            }
        }



        let query = {};
        if (filter && filter.difficulty) {
            query.difficulty = filter.difficulty;//con esto si paso XL desde el front no tengo que hacer conversiones
        }

        const count = await Task.countDocuments(query);
        console.log(`Conteo de tareas desde el back (${filter?.difficulty || 'Todas'}): ${count}`);
        if(redisClient){
            await redisClient.setEx(cacheKey, 60, JSON.stringify(count));
            console.log("He guardado en cache el conteo de tareas durante 60 s")
        }
        return count;
    }
    catch (error) {
        console.error('Error al obtener el conteo de tareas:', error);
        throw new Error('Error al obtener el conteo de tareas');
    }
}

//(La consulta personalizada): Ranking de usuarios con más tareas "hechas"

export const getTaskUserRanking = async (redisClient) => { //TODO guardar en cache
    try {
        const cacheKey = 'tasks:ranking';
        if (redisClient) {
            const cacheData = await redisClient.get(cacheKey);
            if (cacheData) {
                console.log('He cargado el ranking de usuarios desde redis');
                return JSON.parse(cacheData);
            }
        }


        const ranking = await Task.aggregate([
            {
                $match: { status: 'hecha' }
            },
            {
                $group: {
                    _id: "$idU",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {// me estaba liando mucho en solucionar como devolver bien las cosas
                    _id: 0,
                    userName: "$user.userName",
                    tasksCompleted: "$count"
                }
            }
        ]);
        console.log('Ranking de usuarios obtenido correctamente: ' + ranking);
        if(redisClient){
            await redisClient.setEx(cacheKey, 60, JSON.stringify(ranking));
            console.log("He guardado en cache el ranking de usuarios durante 60 s")
        }
        return ranking;

    } catch (error) {
        console.error('Error al obtener el ranking de usuarios:', error);
        throw new Error('Error al obtener el ranking de usuarios');
    }
}

