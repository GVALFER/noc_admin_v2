import { prisma } from "../../utils/db/prisma.js";
import {
  getUserIp,
  signSession,
  validateHashPassword,
} from "../../utils/index.js";

const STATUS_ACTIVE = ["ACTIVE", "PENDING"];

export const content = async (req, reply) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return reply.code(401).send({
        code: "MISSING_CREDENTIALS",
        error: "Email and password are required",
      });
    }

    const account = await prisma.user_accounts.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      return reply.code(401).send({
        code: "INVALID_CREDENTIALS",
        error: "Email or password is invalid",
      });
    }

    if (!STATUS_ACTIVE.includes(account.user.status)) {
      return reply.code(401).send({
        code: "USER_INACTIVE",
        error: "User is inactive. Please contact support.",
      });
    }

    if (!STATUS_ACTIVE.includes(account.status)) {
      return reply.code(401).send({
        code: "ACCOUNT_INACTIVE",
        error: "Account is inactive. Please contact support.",
      });
    }

    const isPassValid = await validateHashPassword(password, account.hash);

    if (!isPassValid) {
      return reply.code(401).send({
        code: "INVALID_CREDENTIALS",
        error: "Email or password is invalid",
      });
    }

    const session = await signSession();
    const headers = req.headers;

    await prisma.user_sessions.create({
      data: {
        account_id: account.id,
        token: session.tokenHash,
        expires_at: session.expiresAt,
        ip: getUserIp(req) || null,
        agent: headers["user-agent"],
        country: null,
        org: null,
      },
    });

    return reply
      .setCookie(session.cookie.name, session.cookie.value, session.cookie)
      .send({ account_id: account.id });
  } catch (err) {
    throw err;
  }
};

export const schema = {
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 3 },
    },
  },
  response: {
    200: {
      type: "object",
      additionalProperties: false,
      properties: {
        account_id: { type: "string" },
      },
    },
    401: {
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
