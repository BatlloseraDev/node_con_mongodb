//Hacerlo en el HU que corresponde

import User from "../models/UserMongo.js";
import kleur from "kleur";
import bcrypt from 'bcrypt';
import { generateJWT_with_roles } from "../helpers/generate_jwt.js";
import { faker } from "@faker-js/faker";
import { googleVerify } from "../helpers/google-verify.js";



const controlador = {

    getUsers: async (req, res) => {
        try {
            const users = await User.find().lean();
            // hacer siempre el lean por temas de eficiencia si luego voy a trabajarlos como js

            if (users.length > 0) {
                console.log(users);
                console.log(kleur.green().bold('🟢 Listado de usuarios correcto'));
                res.status(200).json(users);
            } else {
                console.log(kleur.red().bold('🔴 No hay usuarios en la base de datos'));
                res.status(200).json({ 'msg': 'No hay usuarios en la base de datos' })
            }
        } catch (error) {
            console.error('❌ Error al obtener los usuarios:', error);
            res.status(500).json({ 'msg': 'Error al obtener los usuarios' });
        }
    },
    getUser: async (req, res) => {
        try {

            const haveRolAdmin = req.roles.some(rol => rol.name === 'admin');

            //verificador de permiso
            if (!haveRolAdmin && req.id != req.params.id) {
                console.log(kleur.red().bold('☠️ No tienes permisos para acceder a otro usuario que no eres tu'));
                res.status(200).json({ 'msg': 'No tienes permisos para acceder a otro usuario que no eres tu' })
                return;
            }



            const user = await User.find({ id: req.params.id });
            if (user.length > 0) {
                console.log(user);
                console.log(kleur.green().bold('🟢 Usuario correcto'));
                res.status(200).json(user);
            } else {
                console.log(kleur.red().bold('🔴 No existe el usuario'));
                res.status(200).json({ 'msg': 'No existe el usuario' })
            }
        } catch (error) {
            console.error('❌ Error al obtener el usuario:', error);
            res.status(500).json({ 'msg': 'Error al obtener el usuario' });
        }
    },//get user by id 
    updateUser: async (req, res) => {
        const { userName, email, password } = req.body;


        const haveRolAdmin = req.roles.some(rol => rol.name === 'admin');

        //verificador de permiso
        if (!haveRolAdmin && req.id != req.params.id) {
            console.log(kleur.red().bold('☠️ No tienes permisos para acceder a otro usuario que no eres tu'));
            res.status(200).json({ 'msg': 'No tienes permisos para acceder a otro usuario que no eres tu' })
        }

        //encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const updatedUser = await User.findOneAndUpdate(
                { id: req.params.id },
                { userName, email, password: hashedPassword },
                { new: true }//esto devuelve el usuario actualizado
            );
            if (updatedUser) {
                console.log(kleur.green().bold('🟢 Usuario actualizado correctamente'));
                res.status(200).json(updatedUser);
            } else {
                console.log(kleur.red().bold('🔴 No se ha actualizado el usuario'));
                res.status(200).json({ 'msg': 'No se ha actualizado el usuario' })
            }
        } catch (error) {
            console.error('❌ Error al actualizar el usuario:', error);
            res.status(500).json({ 'msg': 'Error al actualizar el usuario' });
        }
    },//update user sin cambiar los roles
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.deleteOne({ id: req.params.id });//preguntar tambien el findOneAndDelete
            if (deletedUser.deletedCount > 0) {
                console.log(kleur.green().bold('🟢 Usuario eliminado correctamente'));
                res.status(200).json({ 'msg': 'Usuario eliminado correctamente' });
            } else {
                console.log(kleur.red().bold('🔴 No se ha eliminado el usuario'));
                res.status(200).json({ 'msg': 'No se ha eliminado el usuario' })
            }
        } catch (error) {
            console.error('❌ Error al eliminar el usuario:', error);
            res.status(500).json({ 'msg': 'Error al eliminar el usuario' });
        }
    },
    register: async (req, res) => {
        const { id, userName, email, password } = req.body;
        //encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const newUser = new User({ id, userName, email, password: hashedPassword });
            await newUser.save();
            console.log(kleur.green().bold('🟢 Usuario registrado correctamente'))
            res.status(200).json(newUser);
        } catch (error) {
            console.error('❌ Error al registrar el usuario:', error);
            res.status(500).json({ 'msg': 'Error al registrar el usuario' });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (user && await bcrypt.compare(password, user.password)) {
                console.log(kleur.green().bold('🟢 Usuario logueado correctamente'));
                console.log(kleur.blue().bold('🔵 GENERANDO JWT'));
                const token = generateJWT_with_roles(user.id, user.role);
                res.status(200).json({ user, token });
            } else {
                console.log(kleur.red().bold('🔴 No se ha podido logear el usuario'));
                res.status(200).json({ 'msg': 'No se ha podido logear el usuario' })
            }
        } catch (error) {
            console.error('❌ Error al logear el usuario:', error);
            res.status(500).json({ 'msg': 'Error al logear el usuario' });
        }
    },
    loginGoogle: async (req, res = response) => {
        console.log(req.body);

        const  idToken  = req.body.id_token;
        if (!idToken) {
            return res.status(400).json({ msg: 'No se recibió el idToken' });
        }

        try {
            const { userName, img, email } = await googleVerify(idToken);
        
            const user = await User.findOne({ email });
            if (user) {
                console.log(kleur.green().bold('🟢 Usuario logueado correctamente con Google'));
                console.log(kleur.blue().bold('🔵 GENERANDO JWT'));
                const token = generateJWT_with_roles(user.id, user.role);
                res.status(200).json({ user, token });
            } else {
                const id_n = await User.countDocuments() + 1;
                const newUser = new User({ id: id_n, userName, email, password: ':P' });
                await newUser.save();
                console.log(kleur.green().bold('🟢 Usuario registrado correctamente con Google'));
                console.log(kleur.blue().bold('🔵 GENERANDO JWT'));
                const token = generateJWT_with_roles(newUser.id, newUser.role);
                res.status(200).json({ newUser, token });
            }
        }catch(error){
            console.error('❌ Error al logear el usuario con Google:', error);
            res.status(500).json({ 'msg': 'Error al logear el usuario con Google' });
        }
    
    },
    populateUsers: async (req, res) => {
        try {
            const n = req.params.n;
            const users = [];
            let id_n = await User.countDocuments() + 1;// un poco arcaico
            let temp_password = "" 
            for (let i = 0; i < n; i++) {
                temp_password = faker.internet.password();
                const newUser = new User({
                    id: id_n +i ,
                    userName: faker.internet.username(),
                    email: faker.internet.email(),
                    password: await bcrypt.hash(temp_password, 10)
                });
                users.push(newUser);
                console.log(`Usuario con id: ${id_n +i} y contraseña: ${temp_password} creado correctamente`); // para probar credenciales
            }
        
            await User.insertMany(users);
            console.log(kleur.green().bold('🟢 Usuarios creados correctamente'));
            res.status(200).json(users);

        }catch(error){
            console.error('❌ Error al crear los usuarios de forma masiva:', error);
            res.status(500).json({ 'msg': 'Error al crear los usuarios de forma masiva' });
        }
    }



};

export default controlador;