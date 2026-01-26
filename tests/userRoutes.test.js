import  request  from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";
import { router } from "../routes/userRoutes";

const app = express();
app.use(express.json());
app.use(router);

describe("GET /users", () => {
    it("Debería de retornar los usuarios", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    });
});