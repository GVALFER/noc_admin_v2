"use client";

import * as React from "react";
import { cn } from "@/lib/common/utils";

export type TimelineItem = {
    id?: string | number;
    title: React.ReactNode;
    date: string;
    description?: React.ReactNode;
    current?: boolean;
};

export type TimelineHeading = {
    title?: React.ReactNode;
    button?: React.ReactNode;
};

export function Timeline({ items, className, lineClassName, heading }: { items: TimelineItem[]; className?: string; lineClassName?: string; heading?: TimelineHeading }) {
    return (
        <>
            {heading && (
                <div className="mb-6 flex justify-between gap-4">
                    <div className="text-lg font-bold text-foreground">{heading.title}</div>
                    <div>{heading.button}</div>
                </div>
            )}
            <div className={cn("relative", className)}>
                <ol className="space-y-10" role="list">
                    <div aria-hidden className={cn("pointer-events-none absolute left-[12px] top-0 bottom-0 w-px bg-border", lineClassName)} />
                    {items.map((it, i) => (
                        <li key={it.id ?? i} className="relative pl-10">
                            <span
                                aria-hidden
                                className={cn(
                                    "absolute left-1.5 top-1.5 size-3.5 rounded-full ring-2 ring-background",
                                    it.current ? "bg-muted-foreground" : "bg-muted-foreground/40",
                                )}
                            />
                            <div className="text-md font-semibold text-foreground">{it.title}</div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="inline-block size-1.5 rounded-full bg-muted-foreground/60" />
                                <span className="leading-none">{it.date}</span>
                            </div>
                            {it.description ? <div className="mt-2 text-sm text-muted-foreground">{it.description}</div> : null}
                        </li>
                    ))}
                </ol>
            </div>
        </>
    );
}
