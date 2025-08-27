export const getUserIp = (req) => {
  const cf = req.headers["cf-connecting-ip"];
  const tci = req.headers["true-client-ip"];
  const xff = req.headers["x-forwarded-for"];
  const xffIp =
    typeof xff === "string"
      ? xff.split(",")[0]?.trim()
      : Array.isArray(xff)
        ? xff[0]
        : undefined;

  return cf || tci || xffIp || req.ip;
};
