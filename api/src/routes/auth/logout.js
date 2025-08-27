import { prisma } from "../../utils/db/prisma.js";
import { sessionCookie } from "../../utils/index.js";

export const content = async (req, reply) => {
  try {
    const { cookie_name, path } = sessionCookie();

    await prisma.user_sessions.update({
      where: {
        token: req.session.token,
      },
      data: {
        expires_at: new Date(),
        updated_at: new Date(),
      },
    });

    return reply
      .clearCookie(cookie_name, { path })
      .code(200)
      .send({ message: "Logged out successfully" });
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
        message: { type: "string" },
      },
    },
  },
};
