"use client";
import { Block } from "@/components/ui/block";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Password } from "@/components/ui/password";
import { api } from "@/lib/api/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const Page = () => {
    const FormSchema = z.object({
        email: z.string(),
        password: z.string(),
        number: z.number().min(0).max(100),
    });

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        console.log(values);

        api.post("user/update")
            .json()
            .then(() => {
                toast.success("Form submitted successfully!");
                form.reset();
            })
            .catch(() => {
                toast.error("Failed to submit form");
            });
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            number: 0,
        },
    });

    return (
        <div className="">
            <Header title="Dashboard" description="Browse and manage all registered users in the system." />

            <Block>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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

                        <FormField
                            control={form.control}
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number Form</FormLabel>
                                    <FormControl>
                                        <InputNumber {...field} min={0} max={100} step={1} allowNegative={false} className="w-40" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </Block>
        </div>
    );
};

export default Page;
