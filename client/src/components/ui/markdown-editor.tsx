"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Code2,
    Quote,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Image as ImageIcon,
    SquareChartGantt,
    Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/common/utils";
import { Textarea } from "@/components/ui/textarea";

type BaseTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value" | "defaultValue">;

interface MarkdownEditorProps extends BaseTextareaProps {
    value?: string;
    onChange?: (value: string) => void;
    initialValue?: string;
}

const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str: string, lang: string): string {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + "</code></pre>";
            } catch {}
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>";
    },
});

export const MarkdownEditor = React.forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
    ({ value, onChange, onBlur, name, initialValue = "", className, placeholder = "Write markdown…", ...rest }, forwardedRef) => {
        const isControlled = value !== undefined;
        const [uncontrolled, setUncontrolled] = useState<string>(initialValue);

        const getContent = () => (isControlled ? (value ?? "") : uncontrolled);
        const setContent = (next: string) => {
            if (!isControlled) setUncontrolled(next);
            onChange?.(next);
        };

        const [isPreviewMode, setIsPreviewMode] = useState(false);
        const [showTooltip, setShowTooltip] = useState(false);
        const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
        const [currentSelection, setCurrentSelection] = useState<{ start: number; end: number } | null>(null);

        const textareaRef = useRef<HTMLTextAreaElement | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);
        const tooltipRef = useRef<HTMLDivElement | null>(null);

        const setRefs = (el: HTMLTextAreaElement | null) => {
            textareaRef.current = el;
            if (typeof forwardedRef === "function") forwardedRef(el);
            else if (forwardedRef && el) (forwardedRef as React.RefObject<HTMLTextAreaElement>).current = el;
        };

        const handleContentChange = (next: string) => setContent(next);

        const getSelectionPosition = (start: number) => {
            const textarea = textareaRef.current;
            const container = containerRef.current;
            if (!textarea || !container) return null;

            const textBeforeSelection = textarea.value.substring(0, start);
            const lines = textBeforeSelection.split("\n");
            const currentLine = lines.length - 1;
            const currentColumn = lines[lines.length - 1].length;

            const textareaRect = textarea.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const textareaStyle = window.getComputedStyle(textarea);

            const fontSize = parseInt(textareaStyle.fontSize) || 14;
            const lineHeight = parseInt(textareaStyle.lineHeight) || Math.round(fontSize * 1.5);
            const charWidth = fontSize * 0.6;

            const textareaLeft = textareaRect.left - containerRect.left;
            const textareaTop = textareaRect.top - containerRect.top;
            const paddingLeft = parseInt(textareaStyle.paddingLeft) || 0;
            const paddingTop = parseInt(textareaStyle.paddingTop) || 0;

            const scrollTop = textarea.scrollTop;

            const selectionX = textareaLeft + paddingLeft + currentColumn * charWidth;
            const selectionY = textareaTop + paddingTop + currentLine * lineHeight - scrollTop;

            return { x: selectionX, y: selectionY };
        };

        const checkSelection = useCallback(() => {
            const ta = textareaRef.current;
            if (!ta) return;

            const start = ta.selectionStart ?? 0;
            const end = ta.selectionEnd ?? 0;
            const selectedText = ta.value.substring(start, end);

            if (start !== end && selectedText.trim()) {
                setCurrentSelection({ start, end });

                const pos = getSelectionPosition(start);
                if (pos && containerRef.current && textareaRef.current) {
                    const containerRect = containerRef.current.getBoundingClientRect();
                    const textareaRect = textareaRef.current.getBoundingClientRect();

                    let x = pos.x;
                    let y = pos.y - 200;
                    const tooltipWidth = 450;
                    const minLeft = 40; //  min padding from left

                    if (x + tooltipWidth / 2 > containerRect.width) x = containerRect.width - tooltipWidth / 2;
                    if (x - tooltipWidth / 2 < minLeft) x = tooltipWidth / 2 + minLeft;

                    const textareaTop = textareaRect.top - containerRect.top;
                    if (y < textareaTop) y = pos.y + 25;

                    const textareaBottom = textareaTop + textareaRect.height;
                    if (y + 50 > textareaBottom) {
                        y = pos.y - 60;
                        if (y < textareaTop) y = textareaTop + 10;
                    }

                    setTooltipPosition({ x, y });
                    setShowTooltip(true);
                }
            } else {
                setShowTooltip(false);
                setCurrentSelection(null);
            }
        }, []);

        const applyFormatting = (before: string, after: string = "") => {
            const ta = textareaRef.current;
            if (!ta || !currentSelection) return;

            const content = getContent();
            const { start, end } = currentSelection;
            const selectedText = content.substring(start, end);

            const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
            handleContentChange(newContent);

            setShowTooltip(false);
            setCurrentSelection(null);

            setTimeout(() => {
                ta.focus();
                const newPos = start + before.length + selectedText.length + after.length;
                ta.setSelectionRange(newPos, newPos);
            }, 0);
        };

        const applyLineFormatting = (prefix: string) => {
            const ta = textareaRef.current;
            if (!ta || !currentSelection) return;

            const content = getContent();
            const { start, end } = currentSelection;

            const lines = content.split("\n");
            let lineStart = 0;
            let lineIndex = 0;

            for (let i = 0; i < lines.length; i++) {
                if (lineStart + lines[i].length >= start) {
                    lineIndex = i;
                    break;
                }
                lineStart += lines[i].length + 1;
            }

            lines[lineIndex] = prefix + lines[lineIndex];
            const newContent = lines.join("\n");
            handleContentChange(newContent);

            setShowTooltip(false);
            setCurrentSelection(null);

            setTimeout(() => {
                ta.focus();
                const newPos = end + prefix.length;
                ta.setSelectionRange(newPos, newPos);
            }, 0);
        };

        const applyCodeBlock = () => {
            const ta = textareaRef.current;
            if (!ta || !currentSelection) return;

            const content = getContent();
            const { start, end } = currentSelection;
            const selectedText = content.substring(start, end);

            const beforeText = content.substring(0, start);
            const afterText = content.substring(end);

            const needsNewlineBefore = beforeText.length > 0 && !beforeText.endsWith("\n");
            const needsNewlineAfter = afterText.length > 0 && !afterText.startsWith("\n");

            const prefix = (needsNewlineBefore ? "\n" : "") + "```\n";
            const suffix = "\n```" + (needsNewlineAfter ? "\n" : "");

            const newContent = beforeText + prefix + selectedText + suffix + afterText;
            handleContentChange(newContent);

            setShowTooltip(false);
            setCurrentSelection(null);

            setTimeout(() => {
                ta.focus();
                const newPos = start + prefix.length + selectedText.length + suffix.length;
                ta.setSelectionRange(newPos, newPos);
            }, 0);
        };

        useEffect(() => {
            const handleMouseUp = () => setTimeout(checkSelection, 10);
            const handleKeyUp = () => setTimeout(checkSelection, 10);
            const handleScroll = () => {
                if (showTooltip) setShowTooltip(false);
            };

            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as Node;
                const clickedTooltip = tooltipRef.current?.contains(target);
                const clickedTextarea = textareaRef.current?.contains(target);
                if (!clickedTooltip && !clickedTextarea) {
                    setShowTooltip(false);
                    setCurrentSelection(null);
                }
            };

            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("keyup", handleKeyUp);
            document.addEventListener("mousedown", handleClickOutside);

            const ta = textareaRef.current;
            ta?.addEventListener("scroll", handleScroll);

            return () => {
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("keyup", handleKeyUp);
                document.removeEventListener("mousedown", handleClickOutside);
                ta?.removeEventListener("scroll", handleScroll);
            };
        }, [showTooltip, checkSelection]);

        const tools = [
            { icon: Heading1, label: "Heading 1", action: () => applyLineFormatting("# ") },
            { icon: Heading2, label: "Heading 2", action: () => applyLineFormatting("## ") },
            { icon: Bold, label: "Bold", action: () => applyFormatting("**", "**") },
            { icon: Italic, label: "Italic", action: () => applyFormatting("*", "*") },
            { icon: Underline, label: "Underline", action: () => applyFormatting("<u>", "</u>") },
            { icon: Strikethrough, label: "Strikethrough", action: () => applyFormatting("~~", "~~") },
            { icon: Code, label: "Inline Code", action: () => applyFormatting("`", "`") },
            { icon: Code2, label: "Code Block", action: applyCodeBlock },
            { icon: Quote, label: "Quote", action: () => applyLineFormatting("> ") },
            { icon: List, label: "Bullet List", action: () => applyLineFormatting("- ") },
            { icon: ListOrdered, label: "Numbered List", action: () => applyLineFormatting("1. ") },
            { icon: LinkIcon, label: "Link", action: () => applyFormatting("[", "](url)") },
            { icon: ImageIcon, label: "Image", action: () => applyFormatting("![", "](image-url)") },
        ];

        const renderedContent = md.render(getContent());

        return (
            <TooltipProvider>
                <div ref={containerRef} className={cn("relative w-full h-full flex flex-col", className)}>
                    <div className="relative">
                        <Textarea
                            ref={setRefs}
                            name={name}
                            value={getContent()}
                            onChange={(e) => handleContentChange(e.target.value)}
                            onBlur={(e) => onBlur?.(e)}
                            placeholder={placeholder}
                            className="h-full min-h-[100px] resize-none font-mono"
                            {...rest}
                        />

                        <div className="absolute bottom-3 right-3">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setIsPreviewMode(!isPreviewMode);
                                            setShowTooltip(false);
                                            setCurrentSelection(null);
                                        }}
                                        className="h-8 w-8 p-0 bg-background/80 hover:bg-background border border-border/50"
                                    >
                                        {isPreviewMode ? <Minus className="h-4 w-4" /> : <SquareChartGantt className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isPreviewMode ? "Close Preview" : "Open Preview"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {isPreviewMode && (
                        <div className="mt-4 w-full min-h-[300px] p-4 border border-border rounded-lg overflow-auto bg-muted/30">
                            <div className="text-xs text-muted-foreground mb-3 font-medium">Preview</div>
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert [&_pre.hljs]:bg-muted [&_pre.hljs]:border [&_pre.hljs]:rounded-md [&_pre.hljs]:p-4 [&_pre.hljs]:overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: renderedContent }}
                            />
                        </div>
                    )}

                    {showTooltip && (
                        <div
                            ref={tooltipRef}
                            className="absolute z-50 bg-popover border border-border rounded-lg shadow-lg p-2 animate-in fade-in-0 zoom-in-95 duration-200"
                            style={{ left: tooltipPosition.x, top: tooltipPosition.y, transform: "translateX(-50%)" }}
                        >
                            <div className="flex items-center gap-1">
                                {tools.map((tool, index) => (
                                    <div key={index} className="flex items-center">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-accent"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        tool.action();
                                                    }}
                                                >
                                                    <tool.icon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{tool.label}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {(index === 1 || index === 7 || index === 8 || index === 10) && <Separator orientation="vertical" className="h-6 mx-1" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </TooltipProvider>
        );
    },
);

MarkdownEditor.displayName = "MarkdownEditor";
