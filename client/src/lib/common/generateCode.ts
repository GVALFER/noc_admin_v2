export interface GenerateCodeOptions {
    length?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    characters?: boolean;
}

export const generateCode = ({ length = 8, uppercase = true, lowercase = false, numbers = false, characters = false }: GenerateCodeOptions = {}): string => {
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numChars = "0123456789";
    const specialChars = "!@#$%?";

    let charSet = "";
    if (uppercase) charSet += upperChars;
    if (lowercase) charSet += lowerChars;
    if (numbers) charSet += numChars;
    if (characters) charSet += specialChars;

    if (charSet === "") return "";

    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        code += charSet[randomIndex];
    }
    return code;
};
