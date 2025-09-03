export const getFavicon = (url: string, size: number = 32, returnAllSources: boolean = false) => {
    try {
        if (!url) return null;

        let domain;
        if (url.includes("://")) {
            domain = new URL(url).hostname;
        } else {
            domain = new URL(`https://${url}`).hostname;
        }

        if (domain.startsWith("www.")) {
            domain = domain.substring(4);
        }

        const secureUrl = `https://${domain}`;

        const faviconSources = [
            `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(secureUrl)}&size=${size}`,
            `https://icon.horse/icon/${domain}`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
            `${secureUrl}/favicon.ico`,
            `${secureUrl}/favicon.png`,
            `${secureUrl}/apple-touch-icon.png`,
            `${secureUrl}/apple-touch-icon-precomposed.png`,
        ];

        return returnAllSources ? faviconSources : faviconSources[0];
    } catch (error) {
        console.error("Erro ao gerar URL do favicon:", error);
        return null;
    }
};
