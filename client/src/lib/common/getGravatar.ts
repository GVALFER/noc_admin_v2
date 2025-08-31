import md5 from "md5";

export type GravatarProps = {
    email: string;
    size?: number;
    fallback?: string;
};

export const gravatarUrl = ({ email, size, fallback }: GravatarProps) => {
    const base = "https://www.gravatar.com/avatar/";
    const hash = md5(email.trim().toLowerCase());
    const finalSize = size ?? 80;
    const finalFallback = fallback ?? "identicon";
    return `${base}${hash}?s=${finalSize}&d=${finalFallback}`;
};
