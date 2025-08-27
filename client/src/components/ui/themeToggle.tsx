"use client";

import * as React from "react";
import { Moon, Sun, Cog } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";

export const ThemeToggle = () => {
    const { setTheme } = useTheme();

    return (
        <div className="flex items-center space-x-2">
            <Button startContent={<Sun />} size="sm" variant="outline" onClick={() => setTheme("light")}>
                Light
            </Button>
            <Button startContent={<Moon />} size="sm" variant="outline" onClick={() => setTheme("dark")}>
                Dark
            </Button>
            <Button startContent={<Cog />} size="sm" variant="outline" onClick={() => setTheme("system")}>
                System
            </Button>
        </div>
    );
};
