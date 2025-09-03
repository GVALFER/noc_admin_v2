"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api, parseError } from "@/lib/api/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Helpers } from "../types/helpers";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Password } from "@/components/ui/password";
import { useSession } from "@/providers/sessionProvider";
import { getRole } from "@/lib/common/getRole";

const CreateAccount = ({ helpers, userId }: { helpers: Helpers; userId: string }) => {
    const [open, setOpen] = useState(false);
    const query = useQueryClient();
    const session = useSession();

    const { index } = getRole(session.role);

    const accRoles = useMemo(() => helpers.userAccountRoles ?? [], [helpers?.userAccountRoles]);
    const userStatuses = useMemo(() => helpers.userStatuses ?? [], [helpers?.userStatuses]);

    const formSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(2, { message: "Name must be at least 2 characters." }),
                email: z.string({ message: "Email é obrigatório" }).trim().min(1, { message: "Email é obrigatório" }).email({ message: "Email inválido" }),
                phone: z.string().min(10, { message: "Phone number must be at least 10 characters." }).optional().or(z.literal("")),
                role: z.enum(accRoles),
                status: z.enum(userStatuses),
                password: z.string().min(3, { message: "Password must be at least 3 characters." }),
            }),
        [userStatuses, accRoles],
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "MEMBER",
            status: "ACTIVE",
            password: "",
        },
    });

    const { mutate } = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            return api.post("users/account", { json: { user_id: userId, ...values } }).json();
        },
        onSuccess: () => {
            toast.success("Form submitted successfully!");
            query.invalidateQueries({ queryKey: ["users"] });
            setOpen(false);
            form.reset();
        },
        onError: (err) => {
            toast.error(parseError(err).message || "Failed to submit form");
        },
    });

    if (index > 0) {
        return null;
    }

    return (
        <>
            <Button variant="default" size="sm" onClick={() => setOpen(true)}>
                <Plus className="size-4" />
            </Button>
            <Modal size="lg" dismissible={false} onOpenChange={setOpen} open={open} header="Create Admin Account" description="Create a new admin account for this admin.">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((val) => mutate(val))} className="space-y-6 max-w-2xl">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="tel" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            options={accRoles.map((role) => ({
                                                label: role,
                                                value: role,
                                            }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                            isSearchable={false}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            options={userStatuses.map((status) => ({
                                                label: status,
                                                value: status,
                                            }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                            isSearchable={false}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Password {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Create</Button>
                    </form>
                </Form>{" "}
            </Modal>
        </>
    );
};

export default CreateAccount;
