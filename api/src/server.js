// server.js
import fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import routes from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = fastify({
  trustProxy: true,
});

// Register plugins
await app.register(cookie);

// Cors configuration
await app.register(cors, {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
});

app.setErrorHandler((err, req, reply) => {
  return reply
    .status(500)
    .send({ code: "INTERNAL_ERROR", error: "Internal Server Error" });
});

// Register routes
await app.register(routes);

try {
  await app.listen({ port: 3100, host: "0.0.0.0" });
  console.log(`🔹 API a correr em: http://0.0.0.0:3100`);
} catch (err) {
  console.log("Error starting server:", err);
  process.exit(1);
}
