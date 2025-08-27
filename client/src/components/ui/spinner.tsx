"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/common/utils";

type SpinnerSize = "sm" | "md" | "lg" | "xl" | "2xl";
type SpinnerVariant = "classic" | "bounce" | "dots" | "spiral";
type SpinnerColor = "default" | "primary" | "secondary" | "destructive" | "muted" | "accent";

interface SpinnerProps {
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    color?: SpinnerColor;
    className?: string;
}

const sizeMap = {
    sm: { box: 16, ring: 2, dot: 6, spiralBox: 28, spiralDot: 6, spiralRadius: 10 },
    md: { box: 20, ring: 3, dot: 8, spiralBox: 36, spiralDot: 8, spiralRadius: 14 },
    lg: { box: 24, ring: 4, dot: 10, spiralBox: 48, spiralDot: 10, spiralRadius: 18 },
    xl: { box: 32, ring: 5, dot: 12, spiralBox: 64, spiralDot: 12, spiralRadius: 24 },
    "2xl": { box: 48, ring: 6, dot: 16, spiralBox: 96, spiralDot: 16, spiralRadius: 36 },
} as const;

const toneClass: Record<SpinnerColor, string> = {
    default: "text-white",
    primary: "text-primary",
    secondary: "text-secondary",
    destructive: "text-destructive",
    muted: "text-muted-foreground",
    accent: "text-accent",
};

export default function Spinner({ size = "md", variant = "classic", color = "default", className }: SpinnerProps) {
    const s = sizeMap[size];
    const tone = toneClass[color];

    if (variant === "classic") {
        const track = "color-mix(in oklch, currentColor 20%, transparent)";
        return (
            <span role="status" aria-label="Loading" className={cn("flex items-center", tone, className)}>
                <span
                    aria-hidden
                    className="inline-block rounded-full animate-spin"
                    style={{
                        width: s.box,
                        height: s.box,
                        borderWidth: s.ring,
                        borderStyle: "solid",
                        borderColor: track,
                        borderTopColor: "currentColor",
                    }}
                />
            </span>
        );
    }

    if (variant === "bounce") {
        return (
            <span role="status" aria-label="Loading" className={cn("inline-flex items-center justify-center gap-2", tone, className)}>
                <span className="rounded-full bg-current animate-bounce [animation-delay:-0.3s]" style={{ width: s.dot, height: s.dot }} />
                <span className="rounded-full bg-current animate-bounce [animation-delay:-0.15s]" style={{ width: s.dot, height: s.dot }} />
                <span className="rounded-full bg-current animate-bounce" style={{ width: s.dot, height: s.dot }} />
            </span>
        );
    }

    if (variant === "dots") {
        return (
            <span role="status" aria-label="Loading" className={cn("inline-flex items-center justify-center gap-2", tone, className)}>
                {[0, 0.25, 0.5].map((d, i) => (
                    <motion.span
                        key={i}
                        className="rounded-full bg-current"
                        style={{ width: s.dot, height: s.dot }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, delay: d }}
                    />
                ))}
            </span>
        );
    }

    // spiral
    const dots = 8;
    return (
        <span role="status" aria-label="Loading" className={cn("inline-block relative align-middle", tone, className)} style={{ width: s.spiralBox, height: s.spiralBox }}>
            {Array.from({ length: dots }).map((_, i) => {
                const angle = (i / dots) * Math.PI * 2;
                const x = s.spiralRadius * Math.cos(angle);
                const y = s.spiralRadius * Math.sin(angle);
                return (
                    <motion.span
                        key={i}
                        className="absolute rounded-full bg-current"
                        style={
                            {
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                width: s.spiralDot,
                                height: s.spiralDot,
                                translateX: "-50%",
                                translateY: "-50%",
                            } as React.CSSProperties
                        }
                        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: (i / dots) * 1.4 }}
                    />
                );
            })}
        </span>
    );
}
