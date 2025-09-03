"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api, parseError } from "@/lib/api/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdateAccount = ({ data, helpers }) => {
    const query = useQueryClient();

    const accRoles = useMemo(() => helpers.userAccountRoles ?? [], [helpers?.userAccountRoles]);
    const userStatuses = useMemo(() => helpers.userStatuses ?? [], [helpers?.userStatuses]);

    const formSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(2, { message: "Name must be at least 2 characters." }),
                email: z.string({ message: "Email é obrigatório" }).trim().min(1, { message: "Email é obrigatório" }).email({ message: "Email inválido" }),
                notifications: z.boolean().optional(),
                phone: z.string().min(10, { message: "Phone number must be at least 10 characters." }).optional().or(z.literal("")),
                role: z.string().min(2, { message: "Role must be at least 2 characters." }),
                status: z.enum(userStatuses),
            }),
        [userStatuses],
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data?.name || "",
            email: data?.email || "",
            notifications: data?.notifications || false,
            phone: data?.phone || "",
            role: data?.role || "",
            status: data?.status || "ACTIVE",
        },
    });

    const { mutate } = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            return api
                .put("users/account", {
                    json: {
                        id: data?.id,
                        ...values,
                    },
                })
                .json();
        },
        onSuccess: () => {
            toast.success("Form submitted successfully!");
            query.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err) => {
            toast.error(parseError(err).message || "Failed to submit form");
        },
    });

    return (
        <>
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
                        name="notifications"
                        render={({ field }) => (
                            <FormItem className={`flex items-center justify-between rounded-lg border border-dashed ${field.value ? "border-success" : "border-destructive"} p-3`}>
                                <div className="space-y-0.5">
                                    <FormLabel>Notifications</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value ?? false} onCheckedChange={field.onChange} onBlur={field.onBlur} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Update</Button>
                </form>
            </Form>
        </>
    );
};

export default UpdateAccount;
