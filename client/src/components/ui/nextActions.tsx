import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/common/utils";

type NextActionsItem = {
    label?: string;
    separator?: boolean;
    icon?: React.ReactNode;
    [key: string]: unknown;
};

type NextActionsProps = {
    items: NextActionsItem[];
    align?: "start" | "center" | "end";
    className?: string;
    [key: string]: unknown;
};

export const NextActions = ({ items, align = "end", className, ...contentProps }: NextActionsProps) => {
    return (
        <div className="flex justify-end w-full">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex">
                        <EllipsisVertical className="size-4" />
                        <span className="sr-only">Open menu</span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={align} className={cn("w-32", className)} {...contentProps}>
                    {items && items.length > 0
                        ? items.map((item, i) => (
                              <React.Fragment key={i}>
                                  {item.separator ? (
                                      <DropdownMenuSeparator />
                                  ) : (
                                      <DropdownMenuItem {...item}>
                                          {item.icon ? <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-muted-foreground">{item.icon}</span> : null}
                                          <span className="truncate">{item.label}</span>

                                          {item.shortcut ? <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut> : null}
                                      </DropdownMenuItem>
                                  )}
                              </React.Fragment>
                          ))
                        : null}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
