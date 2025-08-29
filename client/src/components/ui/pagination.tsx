"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/common/utils";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    className?: string;
    siblingCount?: number;
    boundaryCount?: number;
    asLink?: (page: number) => string;
    disabled?: boolean;
}

interface PaginationItemProps {
    page: number;
    currentPage: number;
    asLink?: (page: number) => string;
    disabled?: boolean;
    onClick: () => void;
    isReady: boolean;
}

interface NavigationButtonProps {
    direction: "prev" | "next";
    page: number;
    disabled: boolean;
    asLink?: (page: number) => string;
    onClick: () => void;
}

export const Pagination = ({ page, totalPages, onPageChange, className, siblingCount = 1, boundaryCount = 1, asLink, disabled }: PaginationProps) => {
    const listRef = useRef<HTMLUListElement>(null);
    const [isReady, setIsReady] = useState(false);
    const limelightRef = useRef<HTMLDivElement | null>(null);

    const updateLimelight = useCallback(() => {
        const list = listRef.current;
        const limelight = limelightRef.current;
        if (!list || !limelight) return;

        const activeLi = list.querySelector<HTMLElement>(`li[data-page="${page}"]`);
        if (!activeLi) return;

        const listBox = list.getBoundingClientRect();
        const box = activeLi.getBoundingClientRect();
        const newLeft = box.left - listBox.left + box.width / 2 - limelight.offsetWidth / 2;

        limelight.style.left = `${newLeft}px`;
        if (!isReady) {
            setTimeout(() => setIsReady(true), 50);
        }
    }, [page, isReady]);

    useLayoutEffect(updateLimelight, [page, totalPages, updateLimelight]);
    useEffect(() => {
        const handleResize = () => updateLimelight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [updateLimelight]);

    if (totalPages <= 1) return null;

    const items = generatePaginationItems({
        current: page,
        total: totalPages,
        siblingCount,
        boundaryCount,
    });

    const handlePageChange = (targetPage: number) => {
        if (disabled || asLink) return;
        onPageChange?.(targetPage);
    };

    const isPrevDisabled = page <= 1 || disabled;
    const isNextDisabled = page >= totalPages || disabled;

    return (
        <nav className={cn("relative inline-flex items-center gap-1 rounded-xl text-foreground bg-secondary px-2 py-1", className)} aria-label="Navegation pages">
            <NavigationButton direction="prev" page={page - 1} disabled={!!isPrevDisabled} asLink={asLink} onClick={() => handlePageChange(page - 1)} />

            <ul ref={listRef} className="relative flex items-center gap-1">
                <div
                    ref={limelightRef}
                    className={cn("absolute top-0 z-10 w-9 h-9 rounded-full bg-primary shadow-xl", isReady ? "transition-[left] duration-300 ease-in-out" : "")}
                    style={{ left: "-999px" }}
                />

                {items.map((item, index) =>
                    item === "ellipsis" ? (
                        <li key={`ellipsis-${index}`} className="px-2 text-muted-foreground select-none">
                            …
                        </li>
                    ) : (
                        <PaginationItem
                            key={`page-${item}`}
                            page={item}
                            currentPage={page}
                            asLink={asLink}
                            disabled={disabled}
                            onClick={() => handlePageChange(item)}
                            isReady={isReady}
                        />
                    ),
                )}
            </ul>

            <NavigationButton direction="next" page={page + 1} disabled={!!isNextDisabled} asLink={asLink} onClick={() => handlePageChange(page + 1)} />
        </nav>
    );
};

const NavigationButton = ({ direction, page, disabled, asLink, onClick }: NavigationButtonProps) => {
    const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
    const label = direction === "prev" ? "Previous" : "Next";

    const buttonClass = "h-9 w-9 rounded-full text-foreground hover:bg-muted focus:hover:bg-transparent transition-all duration-200 active:scale-95";

    if (asLink && !disabled) {
        return (
            <Button asChild variant="ghost" className={buttonClass}>
                <Link href={asLink(page)} aria-label={label}>
                    <Icon className="h-4 w-4" />
                </Link>
            </Button>
        );
    }

    return (
        <Button variant="ghost" className={buttonClass} onClick={onClick} disabled={disabled} aria-label={label}>
            <Icon className="h-4 w-4" />
        </Button>
    );
};

const PaginationItem = ({ page, currentPage, asLink, disabled, onClick, isReady }: PaginationItemProps) => {
    const isActive = page === currentPage;

    const buttonClass = cn(
        "h-9 w-9 rounded-full transition-opacity duration-200 relative z-20 text-sm",
        isActive && isReady ? "opacity-100 text-primary-foreground" : "opacity-60 hover:opacity-70 text-foreground",
    );

    return (
        <li data-page={page}>
            {asLink && !isActive ? (
                <button className={buttonClass}>
                    <Link href={asLink(page)} aria-label={`Go to pagea ${page}`}>
                        <span className="relative z-30">{page}</span>
                    </Link>
                </button>
            ) : (
                <button className={buttonClass} onClick={onClick} disabled={disabled} aria-current={isActive ? "page" : undefined} aria-label={`Got o page ${page}`}>
                    <span className="relative z-30">{page}</span>
                </button>
            )}
        </li>
    );
};

const createRange = (start: number, end: number): number[] => Array.from({ length: end - start + 1 }, (_, i) => start + i);

const generatePaginationItems = ({ current, total, siblingCount, boundaryCount }: { current: number; total: number; siblingCount: number; boundaryCount: number }) => {
    const startPages = createRange(1, Math.min(boundaryCount, total));
    const endPages = createRange(Math.max(total - boundaryCount + 1, boundaryCount + 1), total);

    const siblingsStart = Math.max(Math.min(current - siblingCount, total - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);

    const siblingsEnd = Math.min(Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2), endPages.length > 0 ? endPages[0] - 2 : total - 1);

    const items: (number | "ellipsis")[] = [];

    items.push(...startPages);

    if (siblingsStart > boundaryCount + 2) {
        items.push("ellipsis");
    } else if (boundaryCount + 1 < total - boundaryCount) {
        items.push(boundaryCount + 1);
    }

    items.push(...createRange(siblingsStart, siblingsEnd));

    if (siblingsEnd < total - boundaryCount - 1) {
        items.push("ellipsis");
    } else if (total - boundaryCount > boundaryCount) {
        items.push(total - boundaryCount);
    }

    items.push(...endPages);

    return items.filter((value, index, array) => index === 0 || value !== array[index - 1]);
};
