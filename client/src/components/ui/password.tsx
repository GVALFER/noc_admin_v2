"use client";

import { useId, useState, forwardRef } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Password = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>((props, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const id = useId();

    return (
        <div className="relative">
            <Input {...props} ref={ref} id={id} type={isVisible ? "text" : "password"} placeholder="Password" className="pe-9" autoComplete="current-password" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible((prevState) => !prevState)}
                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 end-0 rounded-s-none hover:bg-transparent"
            >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                <span className="sr-only">{isVisible ? "Hide password" : "Show password"}</span>
            </Button>
        </div>
    );
});

Password.displayName = "Password";
