"use client";

import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/common/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InputNumberProps extends Omit<React.ComponentProps<typeof Input>, "type" | "onChange" | "value" | "startContent" | "endContent"> {
    value?: number | string;
    onChange?: (value: number | undefined) => void;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    allowNegative?: boolean;
    allowDecimal?: boolean;
    showButtons?: boolean;
    buttonVariant?: "default" | "outline" | "ghost";
}

export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
    (
        {
            value,
            onChange,
            min,
            max,
            step = 1,
            precision = 0,
            allowNegative = true,
            allowDecimal = true,
            placeholder = "0",
            disabled,
            className,
            showButtons = true,
            buttonVariant = "ghost",
            onBlur,
            onKeyDown,
            ...props
        },
        ref,
    ) => {
        const [internalValue, setInternalValue] = React.useState<string>(() => ((value ?? value === 0) ? String(value) : ""));

        React.useEffect(() => {
            if (value === undefined || value === null) setInternalValue("");
            else setInternalValue(String(value));
        }, [value]);

        const getDecimalPlaces = (num: number): number => {
            if (num % 1 === 0) return 0;

            const decimalStr = num.toString().split(".")[1];
            return decimalStr ? decimalStr.length : 0;
        };

        const roundToPrecision = (num: number, decimalPlaces: number): number => {
            return Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
        };

        const formatNumber = (num: number) => {
            if (precision > 0) {
                return num.toFixed(precision);
            }

            const stepDecimals = getDecimalPlaces(step);
            if (stepDecimals > 0) {
                const rounded = roundToPrecision(num, stepDecimals);
                return rounded.toFixed(stepDecimals);
            }

            return String(num);
        };

        const parseValue = (v: string): number | undefined => {
            if (!v || v === "-") return undefined;
            const n = allowDecimal ? parseFloat(v) : parseInt(v, 10);
            return Number.isNaN(n) ? undefined : n;
        };
        const constrain = (n: number) => {
            if (!allowNegative && n < 0) n = 0;
            if (min !== undefined && n < min) n = min;
            if (max !== undefined && n > max) n = max;
            return n;
        };
        const curr = () => parseValue(internalValue) ?? 0;
        const setNum = (n: number) => {
            const c = constrain(n);
            setInternalValue(formatNumber(c));
            onChange?.(c);
        };
        const inc = () => {
            if (!disabled) {
                const currentVal = curr();
                const newVal = currentVal + step;
                const stepDecimals = getDecimalPlaces(step);
                const roundedVal = stepDecimals > 0 ? roundToPrecision(newVal, stepDecimals) : newVal;
                setNum(roundedVal);
            }
        };
        const dec = () => {
            if (!disabled) {
                const currentVal = curr();
                const newVal = currentVal - step;
                const stepDecimals = getDecimalPlaces(step);
                const roundedVal = stepDecimals > 0 ? roundToPrecision(newVal, stepDecimals) : newVal;
                setNum(roundedVal);
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            if (v === "") {
                setInternalValue("");
                onChange?.(undefined);
                return;
            }
            if (allowNegative && v === "-") {
                setInternalValue("-");
                return;
            }
            const rx = allowDecimal ? (allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/) : allowNegative ? /^-?\d*$/ : /^\d*$/;
            if (!rx.test(v)) return;

            setInternalValue(v);
            const p = parseValue(v);
            if (p !== undefined) onChange?.(constrain(p));
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            const p = parseValue(internalValue);
            if (p !== undefined) {
                const c = constrain(p);
                setInternalValue(formatNumber(c));
                onChange?.(c);
            } else if (internalValue && internalValue !== "-") {
                setInternalValue("");
                onChange?.(undefined);
            }
            onBlur?.(e);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                inc();
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                dec();
                return;
            }
            onKeyDown?.(e);
        };

        const startContent = showButtons ? (
            <Button
                type="button"
                variant={buttonVariant}
                size="icon"
                onClick={dec}
                disabled={disabled || (min !== undefined && curr() - step < min) || (!allowNegative && curr() - step < 0)}
                tabIndex={-1}
                aria-label="Decrement"
                className="h-6 w-6 shrink-0"
            >
                <MinusIcon />
            </Button>
        ) : undefined;

        const endContent = showButtons ? (
            <Button
                type="button"
                variant={buttonVariant}
                size="icon"
                onClick={inc}
                disabled={disabled || (max !== undefined && curr() + step > max)}
                tabIndex={-1}
                aria-label="Increment"
                className="h-6 w-6 shrink-0"
            >
                <PlusIcon />
            </Button>
        ) : undefined;

        return (
            <Input
                ref={ref}
                type="text"
                inputMode={allowDecimal ? "decimal" : "numeric"}
                value={internalValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={cn("w-full max-w-sm", className)}
                inputClassName="text-center font-mono tabular-nums"
                startContent={startContent}
                endContent={endContent}
                {...props}
            />
        );
    },
);

InputNumber.displayName = "InputNumber";
