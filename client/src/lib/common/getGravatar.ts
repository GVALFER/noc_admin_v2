import crypto from "crypto";

export type GravatarProps = {
    email: string;
    size?: number;
    fallback?: string;
};

export const getGravatar = ({ email, size, fallback }: GravatarProps) => {
    const base = "https://www.gravatar.com/avatar/";
    const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
    const finalSize = size ?? 80;
    const finalFallback = fallback ?? "identicon";
    return `${base}${hash}?s=${finalSize}&d=${finalFallback}`;
};
