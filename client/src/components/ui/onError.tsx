import { TriangleAlertIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/common/utils";
import { parseError } from "@/lib/api/fetcher";

export const OnError = ({ error, message, className }: { error?: unknown; message?: string | null; className?: string }) => {
    if (error) {
        message = parseError(error).message;
    }

    return (
        <Alert className={cn("bg-destructive dark:bg-destructive/60 border-none text-white min-w-1/2 w-fit hyphens-auto", className)}>
            <TriangleAlertIcon />
            <AlertTitle className="text-2xl font-bold ml-2">Error</AlertTitle>
            <AlertDescription className="text-white/80 ml-2">{message || "Something went wrong. Please try again or contact support if the issue persists."}</AlertDescription>
        </Alert>
    );
};
