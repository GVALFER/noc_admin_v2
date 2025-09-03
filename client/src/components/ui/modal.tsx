"use client";

import { cn } from "@/lib/common/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

type ModalSize = "auto" | "sm" | "md" | "lg" | "xl" | "full" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
type ModalPosition = "center" | "top" | "bottom";
type ModalBackdrop = "opaque" | "blur" | "transparent" | "opaue";
type ModalShadow = "shadow-xs" | "shadow" | "shadow-md" | "shadow-lg" | "shadow-xl" | "shadow-2xl" | "shadow-soft";

export interface ModalProps extends Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "modal"> {
    size?: ModalSize;
    dismissible?: boolean;
    position?: ModalPosition;
    backdrop?: ModalBackdrop;
    shadow?: ModalShadow;
    header?: React.ReactElement | string;
    description?: React.ReactElement | string;
    footer?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

export function Modal({
    size = "md",
    dismissible = true,
    position = "center",
    backdrop = "blur",
    shadow = "shadow-soft",
    header,
    description,
    footer,
    className,
    children,
    ...rootProps
}: ModalProps) {
    const backdropKind = backdrop === "opaue" ? "opaque" : backdrop;
    const overlayCls = cn(
        "fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        {
            opaque: "bg-black/50",
            blur: "backdrop-blur",
            transparent: "bg-transparent",
        }[backdropKind],
    );

    const sizeCls: Record<ModalSize, string> = {
        auto: "w-auto max-w-max",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "w-full h-full max-w-full",
    };

    const positionCls: Record<ModalPosition, string> = {
        center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        top: "top-4 left-1/2 -translate-x-1/2",
        bottom: "bottom-4 left-1/2 -translate-x-1/2",
    };

    const blockClose = !dismissible
        ? {
              onInteractOutside: (e: Event) => e.preventDefault(),
              onEscapeKeyDown: (e: KeyboardEvent) => e.preventDefault(),
          }
        : undefined;

    return (
        <DialogPrimitive.Root {...rootProps}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className={overlayCls} />

                <DialogPrimitive.Content
                    className={cn(
                        "fixed z-50 flex flex-col w-full max-w-[calc(100%-2rem)] bg-background rounded-lg p-6 duration-200",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        sizeCls[size],
                        size !== "full" && positionCls[position],
                        size === "full" && "inset-0 max-w-none rounded-none",
                        shadow,
                        className,
                    )}
                    {...blockClose}
                >
                    <DialogPrimitive.DialogTitle asChild>
                        {typeof header === "string" ? <div className="text-lg font-semibold leading-none tracking-tight">{header}</div> : header || ""}
                    </DialogPrimitive.DialogTitle>
                    <DialogPrimitive.DialogDescription asChild>
                        {typeof description === "string" ? <div className="text-sm text-muted-foreground mt-2">{description}</div> : description || ""}
                    </DialogPrimitive.DialogDescription>

                    <div className="flex-1 mt-5">{children}</div>

                    {footer ? <div className="mt-auto pt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}

                    <DialogPrimitive.Close
                        className={cn(
                            "absolute top-4 right-4 rounded-xs opacity-70 transition-opacity",
                            "hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            "ring-offset-background",
                        )}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
