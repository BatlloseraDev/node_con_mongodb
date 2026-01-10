import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
//rutas de usuarios 
import { router as userRouter } from '../routes/userRoutes.js';
//rutas de tareas
import { router as taskRouter } from '../routes/taskRoutes.js';
import kleur from 'kleur';
import mongoose from 'mongoose';
mongoose.set('strictQuery', false);


class Server {
    constructor() {
        this.app = express();
        this.userPath = '/api/usuarios';
        this.taskPath = '/api/tareas';

        this.middlewares();

        this.conectarMongoose();

        this.routes();

    }

    conectarMongoose() {
        mongoose.connect(process.env.DB_URL, {
            dbName: process.env.DB_DATABASE,
        });

        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'Error de conexión'));
        this.db.once('open', () => { console.log(kleur.blue().bold('Conectado satisfactoriamente con mongo 🐵')) });
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.userPath, userRouter);
        this.app.use(this.taskPath, taskRouter);
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(kleur.green().bold(`🟢 Servidor Mongo escuchando en el puerto: ${process.env.PORT}`))
        })
        console.log(kleur.blue().bold(`🐵 Mongo: ${process.env.DB_PORT}  /  Datos de conexión: ${process.env.DB_DATABASE} ${process.env.DB_URL}. Conectando...`));
    }
}

export { Server }
