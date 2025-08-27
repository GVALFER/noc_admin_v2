"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/datePicker";
import { SelectOption, Select } from "@/components/ui/select";
import { Dropzone } from "@/components/ui/dropzone";
import { Password } from "@/components/ui/password";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tags } from "@/components/ui/tags";

const onlyAZ09 = /^[A-Za-z0-9]+$/;
const formSchema = z.object({
    email: z.string().optional(),
    checkname: z.boolean().optional(),
    date: z.date().optional(),
    framework: z.string().optional(),
    frameworks: z.array(z.string()).optional(),
    attachments: z.array(z.instanceof(File)).optional(),
    password: z.string().optional(),
    otp: z.string().optional(),
    slider: z.number().min(0).max(100).optional(),
    switcher: z.boolean(),
    textarea: z.string().optional(),
    radiogroup: z.enum(["all", "none"]).optional(),
    tags: z
        .array(z.string().min(1, "Obrigatório"))
        .nonempty("Adiciona pelo menos uma tag")
        .refine((arr) => arr.every((t) => onlyAZ09.test(t)), {
            message: "Apenas letras e números",
        }),
});

export default function MyForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            checkname: false,
            date: new Date(),
            framework: "",
            frameworks: [],
            attachments: [],
            password: "",
            otp: "",
            slider: 0,
            switcher: false,
            textarea: "",
            radiogroup: "all",
            tags: ["react", "nextjs"],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast.success("Form submitted successfully!");
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    const options: SelectOption[] = [
        { value: "react", label: "React" },
        { value: "nextjs", label: "Next.js" },
        { value: "angular", label: "Angular" },
        { value: "vue", label: "VueJS" },
        { value: "django", label: "Django" },
        { value: "astro", label: "Astro" },
    ];

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="" type="email" {...field} />
                                </FormControl>
                                <FormDescription>Put your email</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="checkname"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Use different settings for my mobile devices</FormLabel>
                                    <FormDescription>You can manage your mobile notifications in the mobile settings page.</FormDescription>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data</FormLabel>
                                <FormControl>
                                    <DatePicker {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/*SINGLE*/}
                    <FormField
                        control={form.control}
                        name="framework"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Framework (single)</FormLabel>
                                <FormControl>
                                    <Select
                                        options={options}
                                        isMulti={false}
                                        value={field.value || null}
                                        onChange={(v) => field.onChange(v ?? "")}
                                        placeholder="Select framework…"
                                        searchPlaceholder="Search…"
                                        emptyMessage="No results."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* MULTI */}
                    <FormField
                        control={form.control}
                        name="frameworks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frameworks (multi)</FormLabel>
                                <FormControl>
                                    <Select
                                        options={options}
                                        isMulti={true}
                                        value={field.value ?? []}
                                        onChange={(vals) => field.onChange(vals)}
                                        placeholder="Select frameworks…"
                                        searchPlaceholder="Search…"
                                        emptyMessage="No results."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* MULTI */}
                    <FormField
                        control={form.control}
                        name="attachments"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Anexos (multi)</FormLabel>
                                <FormControl>
                                    <Dropzone
                                        multiple
                                        accept={["image/*", ".pdf", ".zip"]}
                                        maxFiles={8}
                                        maxSizeMB={20}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Arraste ficheiros ou clique"
                                        helperText="Imagens, PDF ou ZIP até 20MB (máx. 8)"
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
                                <FormLabel>Pssword</FormLabel>
                                <FormControl>
                                    <Password placeholder="" {...field} />
                                </FormControl>
                                <FormDescription>Put your password</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>Please enter the one-time password sent to your phone.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slider"
                        render={({ field: { value, onChange } }) => (
                            <FormItem>
                                <FormLabel>Price - {value}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={[value ?? 0]}
                                        onValueChange={(vals) => {
                                            onChange(vals[0]);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Adjust the price by sliding.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="switcher"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Marketing emails</FormLabel>
                                    <FormDescription>Receive emails about new products, features, and more.</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="textarea"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                                </FormControl>
                                <FormDescription>
                                    You can <span>@mention</span> other users and organizations.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="radiogroup"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Notify me about...</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col">
                                        <FormItem className="flex items-center gap-3">
                                            <FormControl>
                                                <RadioGroupItem value="all" />
                                            </FormControl>
                                            <FormLabel className="font-normal">All new messages</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-3">
                                            <FormControl>
                                                <RadioGroupItem value="none" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Nothing</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Tags name={field.name} value={field.value ?? []} onValueChange={field.onChange} onBlur={field.onBlur} placeholder="Type and press [Enter]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}
