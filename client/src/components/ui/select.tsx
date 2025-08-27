"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/common/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type SelectOption = { value: string; label: string; disabled?: boolean };

type BaseProps = {
    options: SelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
    buttonClassName?: string;
    disabled?: boolean;
    allowClear?: boolean;
    isSearchable?: boolean;
    isMulti?: boolean;
};

type SingleProps = BaseProps & {
    isMulti?: false;
    value: string | null;
    onChange: (value: string | null) => void;
};

type MultiProps = BaseProps & {
    isMulti: true;
    value: string[];
    onChange: (value: string[]) => void;
};

type ComboboxProps = SingleProps | MultiProps;

export const Select = ({
    options,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyMessage = "No results.",
    className,
    buttonClassName,
    disabled,
    allowClear = true,
    isSearchable = true,
    isMulti = false,
    value,
    onChange,
}: ComboboxProps) => {
    const [open, setOpen] = React.useState(false);

    const isSelected = (v: string) => (isMulti ? (value as string[]).includes(v) : value === v);

    const toggle = (v: string) => {
        if (isMulti) {
            const curr = value as string[];
            const next = curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v];
            (onChange as (value: string[]) => void)(next);
        } else {
            if (allowClear && value === v) (onChange as (value: string | null) => void)(null);
            else (onChange as (value: string | null) => void)(v);
            setOpen(false);
        }
    };

    const renderButtonContent = () => {
        if (isMulti) {
            const vals = value as string[];

            if (!vals.length) {
                return <span className="text-muted-foreground">{placeholder}</span>;
            }

            return (
                <span className="flex flex-wrap items-center gap-1 pe-2.5">
                    {vals.map((v) => {
                        const opt = options.find((o) => o.value === v);
                        if (!opt) return null;

                        return (
                            <Badge key={v} variant="secondary" className="gap-1">
                                {opt.label}
                                {allowClear && (
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Remover ${opt.label}`}
                                        className="inline-flex size-4 items-center justify-center rounded hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggle(v);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggle(v);
                                            }
                                        }}
                                    >
                                        <XIcon className="size-3" />
                                    </span>
                                )}
                            </Badge>
                        );
                    })}
                </span>
            );
        }
        const sel = options.find((o) => o.value === value);
        return <span className="truncate">{sel?.label ?? placeholder}</span>;
    };

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn("w-full justify-between h-auto min-h-9", buttonClassName)}
                        endContent={<ChevronsUpDownIcon className="h-4 w-4 opacity-50 shrink-0" />}
                    >
                        {renderButtonContent()}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[--radix-popper-anchor-width] min-w-56">
                    <Command>
                        {isSearchable && <CommandInput placeholder={searchPlaceholder} className="h-9" />}
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((opt) => (
                                    <CommandItem key={opt.value} value={opt.value} disabled={opt.disabled} onSelect={() => toggle(opt.value)}>
                                        <span className="truncate">{opt.label}</span>
                                        <CheckIcon className={cn("ml-auto h-4 w-4", isSelected(opt.value) ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
