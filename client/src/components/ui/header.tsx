import React from "react";

interface HeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export const Header = ({ title, description, actions }: HeaderProps) => {
    return (
        <div className="mb-7 mt-3 flex justify-between items-center">
            <div>
                <div className="text-xl font-bold">{title}</div>
                {description && <div className="text-sm text-muted-foreground">{description}</div>}
            </div>
            <div>{actions}</div>
        </div>
    );
};
