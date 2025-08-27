"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/common/utils";

type DatePickerProps = {
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (date: Date | null) => void;
    id?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const isValidDate = (date: Date | undefined) => {
    if (!date) return false;
    return !isNaN(date.getTime());
};

export const DatePicker = ({ value, defaultValue = new Date(), onChange, id = "date", placeholder = "January 01, 2025", disabled, className }: DatePickerProps) => {
    const initial = (value ?? defaultValue ?? null) as Date | null;

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(initial ?? undefined);
    const [month, setMonth] = useState<Date | undefined>(initial ?? undefined);
    const [inputValue, setInputValue] = useState(formatDate(initial ?? undefined));

    useEffect(() => {
        if (value !== undefined) {
            const d = value ?? undefined;
            setDate(d);
            setMonth(d);
            setInputValue(formatDate(d));
        }
    }, [value]);

    return (
        <div className={cn("w-full max-w-xs space-y-2", className)}>
            <div className="relative flex gap-2">
                <Input
                    id={id}
                    value={inputValue}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="bg-background pr-10"
                    onChange={(e) => {
                        const txt = e.target.value;
                        const d = new Date(txt);
                        setInputValue(txt);
                        if (isValidDate(d)) {
                            setDate(d);
                            setMonth(d);
                            onChange?.(d);
                        }
                    }}
                    onBlur={() => {
                        // normaliza o texto com base no estado atual
                        setInputValue(formatDate(date));
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                />

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button type="button" id={`${id}-picker`} variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2" disabled={disabled}>
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Pick a date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                        <Calendar
                            mode="single"
                            selected={date}
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(d) => {
                                setDate(d);
                                setInputValue(formatDate(d));
                                onChange?.(d ?? null);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};
