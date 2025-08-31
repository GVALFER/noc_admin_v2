"use client";

import { NavMain } from "@/components/layout/navMain";
import { NavSystem } from "@/components/layout/navSystem";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/themeToggle";
import {
    Activity,
    BookOpen,
    Briefcase,
    Building,
    CreditCard,
    FileText,
    Handshake,
    ListChecks,
    Network,
    Package,
    Percent,
    Receipt,
    Server,
    Settings,
    ShoppingCart,
    Ticket,
    UserCog,
    Users,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { SearchBar } from "./searchBar";
import { Userbar } from "./userbar";

const Wrapper = ({ children, ...props }: { children: React.ReactNode }) => {
    const data = {
        navMain: [
            {
                title: "Clients",
                url: "#",
                icon: Users,
                isActive: true,
                items: [
                    { title: "Accounts", url: "accounts", icon: Users },
                    { title: "Tickets", url: "tickets", icon: Ticket },
                ],
            },
            {
                title: "Sales",
                url: "#",
                icon: ShoppingCart,
                isActive: false,
                items: [
                    { title: "Orders", url: "orders", icon: Package },
                    { title: "Services", url: "services", icon: Briefcase },
                    { title: "Cancellations", url: "cancellations", icon: XCircle },
                ],
            },
            {
                title: "Finance",
                url: "#",
                icon: CreditCard,
                isActive: false,
                items: [
                    { title: "Invoices", url: "invoices", icon: Receipt },
                    { title: "Transactions", url: "transactions", icon: CreditCard },
                    { title: "Coupons", url: "coupons", icon: Percent },
                ],
            },
            {
                title: "Administration",
                url: "#",
                icon: UserCog,
                isActive: false,
                items: [
                    { title: "Admins", url: "admins", icon: UserCog },
                    { title: "Partners", url: "partners", icon: Handshake },
                    { title: "To-Dos", url: "to-dos", icon: ListChecks },
                ],
            },
            {
                title: "Apps",
                url: "#",
                icon: Server,
                isActive: false,
                items: [
                    { title: "IPAM", url: "ipam", icon: Network },
                    { title: "Colocation", url: "colocation", icon: Building },
                    { title: "Monitoring", url: "monitoring", icon: Activity },
                ],
            },
        ],
        system: [
            { title: "Settings", url: "settings", icon: Settings },
            { title: "Logs", url: "logs", icon: FileText },
            { title: "Documentation", url: "documentation", icon: BookOpen },
        ],
    };

    return (
        <>
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href="/" title="Go to Home">
                                            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                                    ../
                                                </div>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-medium">NOC</span>
                                                    <span className="truncate text-xs">Management</span>
                                                </div>
                                            </SidebarMenuButton>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Go to Home</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain items={data.navMain} />
                    <NavSystem items={data.system} />
                </SidebarContent>
                <SidebarFooter>
                    <Separator className="my-2" />
                    <ThemeToggle />
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <div className="flex justify-between items-center gap-4 border-b">
                    <div className="flex h-16 items-center gap-4 px-4 w-full">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="hidden lg:block mr-2 data-[orientation=vertical]:h-4" />
                        <SearchBar />
                    </div>
                    <div className="flex h-16 items-center gap-2 px-4 justify-end w-auto">
                        <Userbar />
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </>
    );
};

export default Wrapper;
