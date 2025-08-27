"use client";
import { api } from "@/lib/api/fetcher";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Password } from "@/components/ui/password";
import { InputNumber } from "@/components/ui/input-number";

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
        <div className="flex-col  min-h-screen p-8 gap-16 ">
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
                                    <InputNumber {...field} min={0} max={100} step={0.1} allowNegative={false} precision={2} allowDecimal={true} className="w-40" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
};

export default Page;
