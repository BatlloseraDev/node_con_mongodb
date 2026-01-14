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
import typeDefs from '../typeDefs/typeDefs.js';
import resolvers from '../resolvers/resolvers.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { validateJWT_GQL } from '../middlewares/ValidateJWT.js';



class Server {
    constructor() {
        this.app = express();
        this.graphQLPath = '/graphql';
        this.userPath = '/api/usuarios';
        this.taskPath = '/api/tareas';

        this.middlewares();

        this.conectarMongoose();

        this.routes();

        this.serverGraphQL = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [
                {
                    async requestDidStart() {
                        return {
                            async willSendResponse({ response, errors }) {
                                if (errors) {
                                    response.body.singleResult.errors = errors.map(err => ({
                                        message: err.message
                                    }));
                                }
                            },
                        };
                    },
                }
            ]
        })

    }

    conectarMongoose() {
        mongoose.connect(process.env.DB_URL, {
            dbName: process.env.DB_DATABASE,
        });

        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'Error de conexión'));
        this.db.once('open', () => { console.log(kleur.blue().bold('Conectado satisfactoriamente con mongo 🐵')) });
    }

    async start() {
        await this.serverGraphQL.start();
        this.applyGraphQLMiddleware();
        this.listen();
    }
    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.userPath, userRouter);
        this.app.use(this.taskPath, taskRouter);
    }

    applyGraphQLMiddleware() {
        this.app.use(
            this.graphQLPath, express.json(),
            expressMiddleware(this.serverGraphQL, {
                context: async ({ req }) => {
                    try {
                        const context = await validateJWT_GQL({req});
                        console.log('Contexto GraphQL: Contexto validado');
                        return context;
                    } catch (error) {
                        console.log('Error en la validación JWT:', error.message);
                        throw new Error(error.message);
                    }
                },
            }));
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(kleur.green().bold(`🟢 Servidor Mongo escuchando en el puerto: ${process.env.PORT}`));
            console.log(kleur.green().bold(`🟢 GraphQL escuchando en el puerto: ${process.env.DB_URL_GRAPHQL}:${process.env.PORT}${this.graphQLPath}`));
            console.log(kleur.blue().bold(`🔵 Servidor API Rest usuarios escuchando en: ${process.env.DB_URL_GRAPHQL}:${process.env.PORT}${this.userPath}`));
            console.log(kleur.blue().bold(`🔵 Servidor API Rest tasks escuchando en: ${process.env.DB_URL_GRAPHQL}:${process.env.PORT}${this.taskPath}`));
        })
        this.applyGraphQLMiddleware();
        console.log(kleur.blue().bold(`🐵 Mongo: ${process.env.DB_PORT}  /  Datos de conexión: ${process.env.DB_DATABASE} ${process.env.DB_URL}. Conectando...`));
    }
}

export { Server }
