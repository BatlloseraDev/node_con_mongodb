//consultas GraphQL 
import User from "../models/UserMongo";

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