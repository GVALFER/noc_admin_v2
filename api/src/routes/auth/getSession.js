import { UserAccountRole } from "@prisma/client";

export const content = async (req, reply) => {
  try {
    return reply.send(req.user);
  } catch (err) {
    throw err;
  }
};

export const schema = {
  response: {
    200: {
      type: "object",
      additionalProperties: false,
      properties: {
        user_id: { type: "string", format: "uuid" },
        account_id: { type: "string", format: "uuid" },
        name: { type: "string" },
        email: { type: "string", format: "email" },
        role: { type: "string", enum: Object.values(UserAccountRole) },
      },
    },
    401: {
      type: "object",
      additionalProperties: false,
      required: ["code", "error"],
      properties: {
        code: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};
