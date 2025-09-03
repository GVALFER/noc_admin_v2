"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api, parseError } from "@/lib/api/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserMetadataForm from "./adminsUpdateMetadata";
import { UpdateUserProps } from "../types/admins";

const UpdateUser = ({ data, helpers, setOpenModal }: UpdateUserProps) => {
    const query = useQueryClient();

    const userTypes = useMemo(() => helpers.userTypes ?? [], [helpers?.userTypes]);
    const userStatuses = useMemo(() => helpers.userStatuses ?? [], [helpers?.userStatuses]);

    const formSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(2, { message: "Name must be at least 2 characters." }),
                type: z.enum(userTypes),
                status: z.enum(userStatuses),
                metadata: z.record(z.string(), z.string()).optional(),
            }),
        [userTypes, userStatuses],
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data?.name || "",
            type: data?.type || "",
            status: data?.status || "",
            metadata: data?.metadata || {},
        },
    });

    const { mutate } = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            return api.put("users/admin", { json: { id: data?.id, ...values } }).json();
        },
        onSuccess: () => {
            toast.success("Form submitted successfully!");
            query.invalidateQueries({ queryKey: ["users"] });
            setOpenModal?.(false);
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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        options={userTypes.map((type) => ({
                                            label: type,
                                            value: type,
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
                        name="metadata"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Metadata</FormLabel>
                                <FormControl>
                                    <UserMetadataForm initialMetadata={field.value} onChange={(newMetadata) => form.setValue("metadata", newMetadata)} />
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

export default UpdateUser;
