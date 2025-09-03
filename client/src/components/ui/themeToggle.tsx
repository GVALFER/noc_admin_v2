"use client";

import * as React from "react";
import { Moon, Sun, Cog } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/common/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const themes = [
    { key: "light", icon: Sun, label: "Light" },
    { key: "dark", icon: Moon, label: "Dark" },
    { key: "system", icon: Cog, label: "System" },
];

export const ThemeToggle = ({ className }: { className?: string }) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleThemeClick = (key: "light" | "dark" | "system") => {
        setTheme(key);
    };

    return (
        <div className={cn("flex flex-wrap justify-center items-center gap-2", className)}>
            {themes.map(({ key, icon: Icon, label }) => {
                const isActive = mounted ? theme === key : false;
                return (
                    <div key={key} className="flex justify-center items-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    aria-label={label}
                                    className="relative h-6 w-6 rounded-full"
                                    onClick={() => handleThemeClick(key as "light" | "dark" | "system")}
                                    type="button"
                                >
                                    {isActive && (
                                        <motion.div className="absolute inset-0 rounded-full bg-secondary" layoutId="activeTheme" transition={{ type: "spring", duration: 0.5 }} />
                                    )}
                                    <Icon className={cn("relative z-10 m-auto h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">{label}</TooltipContent>
                        </Tooltip>
                    </div>
                );
            })}
        </div>
    );
};
