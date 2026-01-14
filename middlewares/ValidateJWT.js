import jwt from 'jsonwebtoken';
import {response, request} from 'express' 
import kleur from 'kleur';


export const validateJWT = (req, res, next) =>{
    const token = req.header('x-token') //esto lo tengo que establecerlo tambien en el cliente

    if(!token){
        return res.status(401).json({
            'msg': 'No hay token en la peticion'
        });
    }


    try{
        const {id, roles} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        req.id = id;
        req.roles = roles;
        console.log(kleur.blue(`ID ${id} con roles "${roles.map(r => r.name).join(', ')}" ha sido verificado`));
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({
            'msg': 'Token no valido'
        });
    }
}


export const validateJWT_GQL = (context) =>{

    const token = context.req.headers['x-token'];
  

    if(!token){
        throw new Error('No hay token en la peticion');
    }

    try{
        const {id, roles} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        context.user = {id, roles};
    }catch(error){
        throw new Error('Token no valido');
    }
    return context;
}