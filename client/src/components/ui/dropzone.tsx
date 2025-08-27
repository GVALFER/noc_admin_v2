"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/common/utils";
import { Button } from "@/components/ui/button";
import { XIcon, UploadIcon, ImageIcon, FileIcon } from "lucide-react";

type DropzoneProps = {
    value?: File[];
    onChange?: (files: File[]) => void;
    multiple?: boolean;
    accept?: string | string[]; // ex: "image/*,.pdf" or ["image/*", ".pdf"]
    maxFiles?: number; // limit total
    maxSizeMB?: number; // limite per file
    disabled?: boolean;
    id?: string;
    name?: string;
    placeholder?: string;
    className?: string;
    dropAreaClassName?: string;
    helperText?: string;
    showPreviews?: boolean;
};

const toAcceptString = (a?: string | string[]) => (Array.isArray(a) ? a.join(",") : (a ?? ""));

const fileMatchesAccept = (file: File, acceptList: string[]): boolean => {
    if (!acceptList.length) return true;

    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return acceptList.some((rule) => {
        const r = rule.trim().toLowerCase();

        if (!r) return true;

        if (r.endsWith("/*")) {
            const prefix = r.slice(0, -1);
            return type.startsWith(prefix);
        }

        if (r.startsWith(".")) {
            return name.endsWith(r);
        }

        return type === r;
    });
};

const FilePreview = ({ file, idx, showPreviews, onRemove }: { file: File; idx: number; showPreviews: boolean; onRemove: (idx: number) => void }) => {
    const isImage = showPreviews && file.type.startsWith("image/");
    const [url, setUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isImage) return;
        const u = URL.createObjectURL(file);
        setUrl(u);
        return () => URL.revokeObjectURL(u);
    }, [file, isImage]);

    return (
        <li key={`${file.name}-${file.size}-${file.lastModified}-${idx}`} className="flex items-center gap-3 rounded-md border bg-background px-3 py-2">
            {isImage && url ? (
                <div className="relative h-10 w-10 rounded overflow-hidden">
                    <Image src={url} alt={file.name} fill className="object-cover" sizes="40px" unoptimized />
                </div>
            ) : (
                <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-muted">
                    {file.type ? <FileIcon className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                </span>
            )}

            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>

            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(idx)} aria-label={`Remover ${file.name}`}>
                <XIcon className="h-4 w-4" />
            </Button>
        </li>
    );
};

export const Dropzone = ({
    value = [],
    onChange,
    multiple = true,
    accept,
    maxFiles = 10,
    maxSizeMB = 10,
    disabled,
    id = "dropzone",
    name,
    placeholder = "Click or drag files to upload",
    className,
    dropAreaClassName,
    helperText,
    showPreviews = true,
}: DropzoneProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setDragging] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const acceptList = React.useMemo(() => (Array.isArray(accept) ? accept : accept ? accept.split(",") : []).map((s) => s.trim()).filter(Boolean), [accept]);

    const openFileDialog = () => {
        if (disabled) return;

        setError(null);
        inputRef.current?.click();
    };

    const addFiles = (files: File[]) => {
        if (!onChange || disabled) return;

        const next: File[] = [...value];
        const msgs: string[] = [];

        files.forEach((file) => {
            if (!fileMatchesAccept(file, acceptList)) {
                msgs.push(`Tipo não permitido: ${file.name}`);
                return;
            }

            if (file.size > maxSizeMB * 1024 * 1024) {
                msgs.push(`Excede ${maxSizeMB}MB: ${file.name}`);
                return;
            }

            if (!multiple && next.length >= 1) {
                msgs.push("Apenas um ficheiro permitido.");
                return;
            }

            if (multiple && next.length >= maxFiles) {
                msgs.push(`Máximo ${maxFiles} ficheiros.`);
                return;
            }

            const exists = next.some((f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified);
            if (!exists) next.push(file);
        });

        if (!multiple && next.length > 1) {
            next.splice(0, next.length - 1);
        }

        if (msgs.length) setError(msgs.join(" • "));
        onChange(next);
        if (inputRef.current) inputRef.current.value = "";
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        addFiles(files);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files ?? []);
        addFiles(files);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setDragging(true);
    };
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const removeFile = (idx: number) => {
        if (!onChange || disabled) return;
        const next = value.slice();
        next.splice(idx, 1);
        onChange(next);
    };

    return (
        <div className={cn("w-full", className)}>
            <input
                ref={inputRef}
                id={id}
                name={name}
                type="file"
                className="hidden"
                multiple={multiple}
                accept={toAcceptString(accept)}
                onChange={onInputChange}
                disabled={disabled}
            />

            <div
                role="button"
                tabIndex={0}
                aria-disabled={disabled}
                onClick={openFileDialog}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openFileDialog();
                    }
                }}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={cn(
                    "relative flex min-h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-center outline-none transition",
                    "hover:border-ring focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
                    isDragging ? "border-ring bg-accent/40" : "border-muted-foreground/30",
                    disabled && "cursor-not-allowed opacity-60",
                    dropAreaClassName,
                )}
            >
                <UploadIcon className="h-5 w-5 opacity-70" />
                <div className="text-sm text-muted-foreground">{placeholder}</div>
                {helperText && <div className="text-xs text-muted-foreground/80">{helperText}</div>}
                {accept && (
                    <div className="text-[11px] text-muted-foreground/70">
                        Aceita: {toAcceptString(accept)}
                        {multiple ? ` • Máx. ${maxFiles} ficheiros` : null} • Até {maxSizeMB}MB
                    </div>
                )}
            </div>

            {value.length > 0 && (
                <ul className="mt-3 space-y-2">
                    {value.map((file, idx) => (
                        <FilePreview key={`${file.name}-${file.size}-${file.lastModified}-${idx}`} file={file} idx={idx} showPreviews={showPreviews} onRemove={removeFile} />
                    ))}
                </ul>
            )}

            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
    );
};
