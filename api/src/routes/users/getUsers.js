import { prisma } from "../../utils/index.js";

export const content = async (req, reply) => {
  try {
    const users = await prisma.users.findMany();

    reply.status(200).send(users);
  } catch (err) {
    throw err;
  }
};

export const schema = {};
