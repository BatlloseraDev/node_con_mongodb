import request from "supertest";
import express from "express";
import { describe, it, expect, beforeEach } from "vitest";
import { router } from "../routes/userRoutes";
import User from "../models/UserMongo";
import bcrypt from 'bcrypt';
import { hasRole } from "../middlewares/validateRoles";

//Info mockeada
vi.mock('../middlewaress/ValidateJWT.js', () => ({
    validateJWT: (req, res, next) => next(),
}));// hago un bypass a las rutas protegidas


vi.mock("../middlewaress/validateRoles.js", () => ({
    hasRole: (...roles) => (req, res, next) => {
        req.roles = [{ name: 'admin' }];
        next();
    }
})); //bypass para los roles
vi.mock("../helpers/generate_jwt.js", () => ({
    generateJWT_with_roles: vi.fn().mockReturnValue("token_falso_12345"),
}));//bypass de token

//Con esto evito conectarme a la base de datos
vi.mock("../models/UserMongo.js");
vi.mock('bcrypt');

const app = express();
app.use(express.json());
app.use(router);

describe("GET /users", () => {
    beforeEach(() => {
        vi.clearAllMocks();//limpia todos los mocks antes de cada test
    })

    describe("Registro de usuarios", () => {
        it("Debería de registrar un usuario correctamente", async () => {
            const mockUser = {
                id: 1,
                userName: "Alibaba",
                email: "alibaba@example.com",
                password: "password123"
            };

            bcrypt.hash.mockResolvedValue("hashedPassword");

            User.mockImplementation(function (constructorData) {
                return {
                    ...constructorData,
                    save: vi.fn().mockResolvedValue(true)
                };
            });// esto lo he tenido que buscar porque me estaba dando fallos por todos lados.

            const response = await request(app).post("/register").send(mockUser);
            expect(response.status).toBe(200);
            console.log("La respuesta es: ", response.body);
            expect(response.body).toHaveProperty("userName", mockUser.userName);
            expect(response.body).toHaveProperty("email", mockUser.email);

            expect(bcrypt.hash).toHaveBeenCalled();
        });
    });

    describe("Login de usuarios", () => {
        it("Debería de logearse un usuario correctamente", async () => {
            const credentials = {
                email: "alibaba@example.com",
                password: "password123"
            };

            const foundUser = {
                id: 1,
                userName: "Alibaba",
                email: "alibaba@example.com",
                password: "hashedPassword"
            };

           User.findOne.mockResolvedValue(foundUser);
            bcrypt.compare.mockResolvedValue(true);

            const response = await request(app).post("/login").send(credentials);
            expect(response.status).toBe(200);
            console.log("La respuesta es: ", response.body);
            expect(response.body).toHaveProperty("token"); 
            expect(response.body.user).toHaveProperty("email", credentials.email);
            expect(bcrypt.compare).toHaveBeenCalled();
        });
    });

    

});