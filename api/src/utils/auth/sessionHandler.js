import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const validateHashPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const sessionCookie = () => {
  const inProd = process.env.NODE_ENV === "production";

  const COOKIE_NAME =
    process.env.SESSION_NAME ?? (inProd ? "__Host-at" : "__at");

  const SESSION_TTL = (() => {
    const n = Number(process.env.SESSION_TTL);
    return Number.isFinite(n) && n > 0 ? n : 7 * 24 * 60 * 60;
  })();

  const REFRESH_EVERY = (() => {
    const n = Number(process.env.SESSION_REFRESH_EVERY);
    return Number.isFinite(n) && n > 0 ? n : 5 * 60;
  })();

  const SAMESITE = process.env.SESSION_SAMESITE ?? "lax";
  const PATH = "/";
  const HTTPONLY = true;
  const SECURE = inProd;
  const DOMAIN =
    inProd && COOKIE_NAME.startsWith("__Host-")
      ? ""
      : process.env.SESSION_DOMAIN || "";

  const cookie = {
    secure: SECURE,
    sameSite: SAMESITE,
    httpOnly: HTTPONLY,
    path: PATH,
    maxAge: SESSION_TTL,
  };

  if (DOMAIN) {
    cookie.domain = DOMAIN;
  }

  return {
    cookie_name: COOKIE_NAME,
    ttl: SESSION_TTL,
    refresh_every: REFRESH_EVERY,
    sameSite: SAMESITE,
    path: PATH,
    httpOnly: HTTPONLY,
    secure: SECURE,
    domain: DOMAIN,
    cookie,
  };
};

export const signSession = async () => {
  const { ttl, cookie_name, cookie } = sessionCookie();

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET");
  }

  const tokenBytes = crypto.randomBytes(32);
  const tokenB64 = tokenBytes.toString("base64url");
  const sigB64 = crypto
    .createHmac("sha256", secret)
    .update(tokenBytes)
    .digest("base64url");
  const value = `${tokenB64}.${sigB64}`;

  const tokenHash = crypto
    .createHash("sha256")
    .update(tokenBytes)
    .digest("hex");

  const expiresAt = new Date(Date.now() + ttl * 1000);

  return {
    value,
    tokenHash,
    expiresAt,
    cookie: {
      ...cookie,
      name: cookie_name,
      value,
      expires: expiresAt,
    },
  };
};

export const verifySession = async (
  cookieValue,
  secrets = [process.env.SESSION_SECRET],
) => {
  if (!cookieValue) return null;

  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return null;

  let tokenBytes, gotSig;
  try {
    const tokenB64 = cookieValue.slice(0, dot);
    const sigB64 = cookieValue.slice(dot + 1);
    tokenBytes = Buffer.from(tokenB64, "base64url");
    gotSig = Buffer.from(sigB64, "base64url");
  } catch {
    return null;
  }

  const list = secrets.filter(Boolean);

  if (list.length === 0) return null;

  for (const s of list) {
    const exp = crypto.createHmac("sha256", s).update(tokenBytes).digest();

    if (gotSig.length === exp.length && crypto.timingSafeEqual(gotSig, exp)) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(tokenBytes)
        .digest("hex");

      return { tokenBytes, tokenHash };
    }
  }

  return null;
};
