import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { generateCode } from "@/lib/common/generateCode";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

type ConfirmationProps = {
    trigger?: React.ReactNode | string;
    title?: React.ReactNode | string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success";
    description?: React.ReactNode | string;
    cancelBtn?: React.ReactNode | string;
    continueBtn?: React.ReactNode | string;
    open: boolean;
    setOpen: (open: boolean) => void;
    defaultOpen?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    children?: React.ReactNode | string;
    isCode?: boolean;
};

const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-white hover:bg-destructive/90",
    outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
    success: "bg-success text-success-foreground hover:bg-success/90",
};

export const Confirmation = ({
    trigger,
    variant = "default",
    title,
    cancelBtn,
    continueBtn,
    open,
    setOpen,
    defaultOpen,
    onConfirm,
    onCancel,
    isCode,
    children,
}: ConfirmationProps) => {
    const [code, setCode] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (open && isCode) {
            setCode(generateCode({ length: 6, numbers: true, uppercase: false, lowercase: false, characters: false }));
            setInputValue("");
        }
    }, [open, isCode]);

    const handleConfirm = () => {
        if (isCode) {
            if (inputValue !== code) {
                return;
            }
        }
        onConfirm?.();
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen} defaultOpen={defaultOpen}>
            {trigger && <AlertDialogTrigger>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title || ""}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            {children || ""}
                            {isCode && (
                                <div className="mt-4 border border-dashed p-3 bg-secondary/60 rounded">
                                    <div className="mb-2">
                                        <div className="font-semibold flex gap-2">
                                            <ShieldCheck size={18} /> Confirmation Code:
                                        </div>
                                        <div className="my-2 flex gap-2">
                                            <div className="border-2 border-dashed px-2 py-1 text-lg font-bold rounded inline-flex">{code}</div>

                                            <InputOTP maxLength={6} onChange={(val) => setInputValue(val)} value={inputValue}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            onCancel?.();
                            setOpen(false);
                        }}
                    >
                        {cancelBtn || "Cancel"}
                    </AlertDialogCancel>
                    <AlertDialogAction className={variants[variant]} onClick={handleConfirm} disabled={isCode && inputValue !== code}>
                        {continueBtn || "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
