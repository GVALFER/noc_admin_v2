"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/common/utils";
import { X as RemoveIcon } from "lucide-react";

const SPLITTER_REGEX = /[\n#?=&\t,./-]+/;
const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g;

interface TagsInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onBlur"> {
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
    maxItems?: number;
    minItems?: number;
    name?: string;
    onBlur?: () => void;
    disabled?: boolean;
    inputClassName?: string;
}

interface TagsInputContextProps {
    value: string[];
    onValueChange: (value: string[]) => void;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TagInputContext = React.createContext<TagsInputContextProps | null>(null);

export const Tags = React.forwardRef<HTMLInputElement, TagsInputProps>(
    ({ value, onValueChange, placeholder, maxItems, minItems, className, dir, name, onBlur, disabled, inputClassName, ...props }, ref) => {
        const [activeIndex, setActiveIndex] = React.useState(-1);
        const [inputValue, setInputValue] = React.useState("");
        const [disableInput, setDisableInput] = React.useState(false);
        const [disableButton, setDisableButton] = React.useState(false);
        const [isValueSelected, setIsValueSelected] = React.useState(false);
        const [selectedValue, setSelectedValue] = React.useState("");

        const inputEl = React.useRef<HTMLInputElement | null>(null);
        const setRefs = (node: HTMLInputElement | null) => {
            inputEl.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref && node) (ref as React.RefObject<HTMLInputElement>).current = node;
        };

        const parseMinItems = minItems ?? 0;
        const parseMaxItems = maxItems ?? Infinity;

        const onValueChangeHandler = React.useCallback(
            (val: string) => {
                if (!value.includes(val) && value.length < parseMaxItems) onValueChange([...value, val]);
            },
            [value, onValueChange, parseMaxItems],
        );

        const RemoveValue = React.useCallback(
            (val: string) => {
                if (value.includes(val) && value.length > parseMinItems) {
                    onValueChange(value.filter((item) => item !== val));
                }
            },
            [value, onValueChange, parseMinItems],
        );

        const handlePaste = React.useCallback(
            (e: React.ClipboardEvent<HTMLInputElement>) => {
                e.preventDefault();
                const tags = e.clipboardData.getData("text").split(SPLITTER_REGEX);
                const newValue = [...value];
                tags.forEach((item) => {
                    const parsedItem = item.replaceAll(FORMATTING_REGEX, "").trim();
                    if (parsedItem.length > 0 && !newValue.includes(parsedItem) && newValue.length < parseMaxItems) {
                        newValue.push(parsedItem);
                    }
                });
                onValueChange(newValue);
                setInputValue("");
            },
            [value, onValueChange, parseMaxItems],
        );

        React.useEffect(() => {
            setDisableButton(!(value.length - 1 >= parseMinItems));
            setDisableInput(!(value.length + 1 <= parseMaxItems));
        }, [value, parseMinItems, parseMaxItems]);

        const handleKeyDown = React.useCallback(
            (e: React.KeyboardEvent<HTMLInputElement>) => {
                e.stopPropagation();

                const moveNext = () => setActiveIndex(activeIndex + 1 > value.length - 1 ? -1 : activeIndex + 1);
                const movePrev = () => setActiveIndex(activeIndex - 1 < 0 ? value.length - 1 : activeIndex - 1);
                const moveCurrent = () => setActiveIndex(activeIndex - 1 <= 0 ? (value.length - 1 === 0 ? -1 : 0) : activeIndex - 1);

                const target = e.currentTarget;

                switch (e.key) {
                    case "ArrowLeft":
                        if (dir === "rtl") {
                            if (value.length > 0 && activeIndex !== -1) moveNext();
                        } else {
                            if (value.length > 0 && target.selectionStart === 0) movePrev();
                        }
                        break;
                    case "ArrowRight":
                        if (dir === "rtl") {
                            if (value.length > 0 && target.selectionStart === 0) movePrev();
                        } else {
                            if (value.length > 0 && activeIndex !== -1) moveNext();
                        }
                        break;
                    case "Backspace":
                    case "Delete":
                        if (value.length > 0) {
                            if (activeIndex !== -1 && activeIndex < value.length) {
                                RemoveValue(value[activeIndex]);
                                moveCurrent();
                            } else if (target.selectionStart === 0) {
                                if (selectedValue === inputValue || isValueSelected) RemoveValue(value[value.length - 1]);
                            }
                        }
                        break;
                    case "Escape":
                        setActiveIndex(activeIndex === -1 ? value.length - 1 : -1);
                        break;
                    case "Enter":
                        if (inputValue.trim() !== "") {
                            e.preventDefault();
                            onValueChangeHandler(inputValue);
                            setInputValue("");
                        }
                        break;
                }
            },
            [activeIndex, value, inputValue, RemoveValue, dir, isValueSelected, onValueChangeHandler, selectedValue],
        );

        const mousePreventDefault = React.useCallback((e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
        }, []);

        const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.currentTarget.value);
        }, []);

        const isInputActuallyDisabled = Boolean(disabled || disableInput);
        const isButtonActuallyDisabled = Boolean(disabled || disableButton);

        return (
            <TagInputContext.Provider value={{ value, onValueChange, inputValue, setInputValue, activeIndex, setActiveIndex }}>
                <div
                    {...props}
                    dir={dir}
                    className={cn(
                        "group/input relative flex w-full min-w-0 flex-wrap items-center gap-1 rounded-md",
                        "border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow]",
                        "dark:bg-input/30",
                        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        "min-h-9",
                        disabled && "opacity-60 pointer-events-none",
                        className,
                    )}
                    onClick={() => inputEl.current?.focus()}
                >
                    {value.map((item, index) => (
                        <Badge
                            tabIndex={activeIndex !== -1 ? 0 : activeIndex}
                            key={item}
                            aria-disabled={isButtonActuallyDisabled}
                            data-active={activeIndex === index}
                            variant="secondary"
                            className={cn(
                                "flex items-center gap-1 rounded px-1 text-xs",
                                "data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground",
                                "aria-disabled:opacity-50 aria-disabled:cursor-not-allowed",
                            )}
                        >
                            <span className="truncate">{item}</span>
                            <button
                                type="button"
                                aria-label={`Remover ${item}`}
                                aria-roledescription="button to remove option"
                                disabled={isButtonActuallyDisabled}
                                onMouseDown={mousePreventDefault}
                                onClick={() => RemoveValue(item)}
                                className="disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Remover {item}</span>
                                <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
                            </button>
                        </Badge>
                    ))}

                    <Input
                        ref={setRefs}
                        name={name}
                        tabIndex={0}
                        aria-label="input tag"
                        disabled={isInputActuallyDisabled}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        value={inputValue}
                        onSelect={(e) => {
                            const t = e.currentTarget;
                            const sel = t.value.substring(t.selectionStart ?? 0, t.selectionEnd ?? 0);
                            setSelectedValue(sel);
                            setIsValueSelected(sel === inputValue);
                        }}
                        onChange={activeIndex === -1 ? handleChange : undefined}
                        placeholder={placeholder}
                        onClick={() => setActiveIndex(-1)}
                        onBlur={onBlur}
                        className={cn(
                            "h-7 flex-1 border-none bg-transparent px-1 py-0 shadow-none",
                            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0",
                            "placeholder:text-muted-foreground",
                            activeIndex !== -1 && "caret-transparent",
                            inputClassName,
                        )}
                    />
                </div>
            </TagInputContext.Provider>
        );
    },
);

Tags.displayName = "Tags";
