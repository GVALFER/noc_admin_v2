type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "outline-success" | "outline-default" | "outline-destructive";

type StatusRef = "ACTIVE" | "OWNER" | "INACTIVE" | "SUSPENDED" | "DELETED" | "PENDING" | "USER" | "ADMIN" | "COMPANY" | "INDIVIDUAL" | "MEMBER";

type VariantType = "solid" | "outline";

type ColorProps = {
    ref: StatusRef | string;
    variant: BadgeVariant;
    bg?: string;
    text?: string;
};

export const getColor = (ref: StatusRef | string, type?: VariantType): ColorProps => {
    let variant: BadgeVariant = "default";
    let bg: string = "";
    let text: string = "";

    switch (ref) {
        case "ACTIVE":
        case "OWNER":
            variant = type === "outline" ? "outline-success" : "success";
            bg = "bg-success";
            text = "text-success-foreground";
            break;
        case "INACTIVE":
        case "SUSPENDED":
        case "DELETED":
            variant = type === "outline" ? "outline-destructive" : "destructive";
            bg = "bg-destructive";
            text = "text-white";
            break;
        case "PENDING":
            variant = type === "outline" ? "outline-default" : "default";
            bg = "bg-primary";
            text = "text-primary-foreground";
            break;
        default:
            variant = type === "outline" ? "outline-default" : "default";
            bg = "bg-primary";
            text = "text-primary-foreground";
            break;
    }

    return { ref, variant, bg, text };
};
