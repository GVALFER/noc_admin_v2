export const buildForwardHeaders = (incoming: Headers) => {
    const out = new Headers();

    const cookie = incoming.get("cookie");
    if (cookie) out.set("cookie", cookie);

    const auth = incoming.get("authorization");
    if (auth) out.set("authorization", auth);

    const xffIn = incoming.get("x-forwarded-for");
    const cf = incoming.get("cf-connecting-ip");
    const xreal = incoming.get("x-real-ip");

    if (xffIn && xffIn.trim()) out.set("x-forwarded-for", xffIn);
    else if (cf || xreal) out.set("x-forwarded-for", (cf || xreal)!);

    const proto = incoming.get("x-forwarded-proto");
    const fwdHost = incoming.get("x-forwarded-host");
    const fwdPort = incoming.get("x-forwarded-port");

    if (proto) out.set("x-forwarded-proto", proto);
    if (fwdHost) out.set("x-forwarded-host", fwdHost);
    if (fwdPort) out.set("x-forwarded-port", fwdPort);

    const origin = incoming.get("origin");
    if (origin) out.set("origin", origin);

    const referer = incoming.get("referer");
    if (referer) out.set("referer", referer);

    const al = incoming.get("accept-language");
    if (al) out.set("accept-language", al);

    const ua = incoming.get("user-agent");
    if (ua) out.set("user-agent", ua);

    const scap = incoming.get("sec-ch-ua-platform");
    if (scap) out.set("sec-ch-ua-platform", scap);

    const scu = incoming.get("sec-ch-ua");
    if (scu) out.set("sec-ch-ua", scu);

    const scum = incoming.get("sec-ch-ua-mobile");
    if (scum) out.set("sec-ch-ua-mobile", scum);

    return out;
};
