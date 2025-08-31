"use client";

import * as React from "react";
import { cn } from "@/lib/common/utils";

interface InputProps extends React.ComponentProps<"input"> {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    inputClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, inputClassName, type = "text", startContent, endContent, ...props }, ref) => {
    const getAutoComplete = () => {
        if (props.autoComplete) return props.autoComplete;
        switch (type) {
            case "email":
                return "email";
            case "password":
                return "current-password";
            case "tel":
                return "tel";
            case "url":
                return "url";
            default:
                return "off";
        }
    };

    if (startContent || endContent) {
        return (
            <div className={cn("relative flex w-full items-center", className)}>
                {startContent && (
                    <div className="text-muted-foreground absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">{startContent}</div>
                )}
                <input
                    ref={ref}
                    type={type}
                    data-slot="input"
                    autoComplete={getAutoComplete()}
                    className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
                        "dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base",
                        "shadow-xs transition-[color,box-shadow] outline-none",
                        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        startContent && "pl-10",
                        endContent && "pr-10",
                        inputClassName,
                    )}
                    {...props}
                />
                {endContent && <div className="absolute right-2 z-10 flex items-center pointer-events-auto">{endContent}</div>}
            </div>
        );
    }

    return (
        <input
            ref={ref}
            type={type}
            data-slot="input"
            autoComplete={getAutoComplete()}
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
                "dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base",
                "shadow-xs transition-[color,box-shadow] outline-none",
                "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className,
            )}
            {...props}
        />
    );
});

Input.displayName = "Input";
