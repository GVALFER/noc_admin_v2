import { SYSTEM } from "../../config/common.js";
import { hashPassword, prisma } from "../../utils/index.js";

export const content = async (req, reply) => {
  try {
    if (!SYSTEM.registrations) {
      return reply.code(403).send({
        code: "FORBIDDEN",
        error: "Registrations are currently disabled",
      });
    }

    const { name, email, password } = req.body || {};

    if (!email || !password || !name) {
      return reply.code(400).send({
        code: "BAD_REQUEST",
        error: "All fields are required: name, email, and password",
      });
    }

    const checkUserExists = await prisma.user_accounts.findUnique({
      where: {
        email,
      },
    });

    if (checkUserExists) {
      return reply.code(409).send({
        code: "CONFLICT",
        error: "Usuário com esse email já existe",
      });
    }

    const user = await prisma.users.create({
      data: {
        name,
        role: "USER",
        type: "INDIVIDUAL",
      },
    });

    const hash = await hashPassword(password);
    const account = await prisma.user_accounts.create({
      data: {
        name,
        email,
        hash,
        user_id: user.id,
        role: "MEMBER",
      },
    });

    return reply.code(201).send({
      user_id: user.id,
      account_id: account.id,
    });
  } catch (err) {
    throw err;
  }
};

export const schema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    additionalProperties: false,
    properties: {
      name: { type: "string", minLength: 2, maxLength: 100 },
      email: { type: "string", format: "email", maxLength: 255 },
      password: { type: "string", minLength: 3, maxLength: 100 },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        user_id: { type: "string", format: "uuid" },
        account_id: { type: "string", format: "uuid" },
      },
    },
    400: {
      type: "object",
      required: ["code", "error"],
      additionalProperties: false,
      properties: {
        code: { type: "string" },
        error: { type: "string" },
      },
    },
    403: {
      type: "object",
      required: ["code", "error"],
      additionalProperties: false,
      properties: {
        code: { type: "string" },
        error: { type: "string" },
      },
    },
    409: {
      type: "object",
      required: ["code", "error"],
      additionalProperties: false,
      properties: {
        code: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};
