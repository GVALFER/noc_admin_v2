import { verifySession, prisma, sessionCookie } from "../index.js";

const STATUS_ACTIVE = ["ACTIVE", "PENDING"];

export const authGuard = async (req, reply) => {
  try {
    const { cookie_name, refresh_every, ttl, cookie, path } = sessionCookie();

    const cookieVal = req.cookies?.[cookie_name];
    const parsed = await verifySession(cookieVal);

    if (!parsed) {
      return reply.clearCookie(cookie_name, { path }).code(403).send({
        code: "FORBIDDEN",
        error: "Session not found or expired.",
      });
    }

    const session = await prisma.user_sessions.findFirst({
      where: {
        token: parsed.tokenHash,
        expires_at: {
          gt: new Date(),
        },
      },
      include: {
        account: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!session) {
      reply.clearCookie(cookie_name, { path });
      return reply.code(403).send({
        code: "FORBIDDEN",
        error: "Session not found or expired.",
      });
    }

    if (!STATUS_ACTIVE.includes(session.account.user.status)) {
      return reply.code(403).send({
        code: "USER_INACTIVE",
        error: "User is inactive. Please contact support.",
      });
    }

    if (!STATUS_ACTIVE.includes(session.account.status)) {
      return reply.code(403).send({
        code: "ACCOUNT_INACTIVE",
        error: "Account is inactive. Please contact support.",
      });
    }

    // TO-DO: Session has a differrent ip or agent - possible hijacking

    // Refresh session if within the refresh window
    const now = Date.now();
    const expMs = new Date(session.expires_at).getTime();

    const lastRefreshMs = Math.max(0, expMs - ttl * 1000);
    const sinceLastRefresh = now - lastRefreshMs;

    if (sinceLastRefresh >= refresh_every * 1000) {
      const newExp = new Date(now + ttl * 1000);

      await prisma.user_sessions.update({
        where: {
          id: session.id,
        },
        data: {
          expires_at: newExp,
        },
      });

      reply.setCookie(cookie_name, cookieVal, { ...cookie, expires: newExp });
    }

    req.session = {
      token: session.token,
      ip: session.ip,
      country: session.country,
      agent: session.agent,
      expires_at: session.expires_at,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };

    req.user = {
      user_id: session.account.user.id,
      account_id: session.account.id,
      email: session.account.email,
      role: session.account.role,
      name: session.account.user.name,
    };
  } catch (err) {
    throw err;
  }
};
