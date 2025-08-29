"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider as UiSlider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datePicker";
import { Dropzone } from "@/components/ui/dropzone";
import { Password } from "@/components/ui/password";
import { Tags } from "@/components/ui/tags";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { CopyIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { InputNumber } from "@/components/ui/input-number";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

type FieldType =
    | "input"
    | "textarea"
    | "password"
    | "checkbox"
    | "switch"
    | "radio"
    | "select"
    | "tags"
    | "datepicker"
    | "dropzone"
    | "slider"
    | "inputOtp"
    | "inputNumber"
    | "markdown";

type Field = {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    inputType?: string;
    isMulti?: boolean; // select/tags/dropzone
    options?: string[]; // radio/select
    min?: number; // slider, inputNumber
    max?: number; // slider, inputNumber
    step?: number; // slider, inputNumber
    precision?: number; // inputNumber - casas decimais
    allowNegative?: boolean; // inputNumber
    allowDecimal?: boolean; // inputNumber
    accept?: string; // dropzone (ex: "image/*,.pdf")
    maxFiles?: number; // dropzone
};

export default function FormBuilderDevPage() {
    const [fields, setFields] = React.useState<Field[]>([]);
    const [formName, setFormName] = React.useState("");
    const [endpoint, setEndpoint] = React.useState("");
    const [draftOptions, setDraftOptions] = React.useState<Record<string, string>>({});

    const addField = () => {
        const id = `${Date.now()}-${Math.random()}`;
        setFields((prev) => [
            ...prev,
            {
                id,
                name: "",
                label: "",
                type: "input",
                required: false,
            },
        ]);
    };

    const removeField = (id: string) => {
        setFields((prev) => prev.filter((f) => f.id !== id));
        setDraftOptions((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== id)));
    };

    const updateField = <K extends keyof Field>(id: string, key: K, value: Field[K]) => {
        setFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
    };

    const code = React.useMemo(() => generateCode({ formName, endpoint, fields }), [formName, endpoint, fields]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied!");
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <div className="mx-auto max-w-[1600px] p-6 space-y-8">
            <header className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold">Form Builder</h1>
                <div className="flex items-center gap-3">
                    <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-[200px]" placeholder="Form component name" />
                    <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="w-[180px]" placeholder="API endpoint" />
                    <Button onClick={addField} startContent={<PlusIcon />}>
                        Add Field
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="p-4 space-y-4">
                    <h2 className="font-semibold">Configuration</h2>
                    {fields.map((f) => (
                        <div key={f.id} className="rounded-lg border p-3 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <Input className="w-44" value={f.name} onChange={(e) => updateField(f.id, "name", safeVar(e.target.value))} placeholder="name" />
                                <Input className="w-56" value={f.label} onChange={(e) => updateField(f.id, "label", e.target.value)} placeholder="label" />

                                <SelectType value={f.type} onChange={(t) => updateField(f.id, "type", t)} />

                                {f.type === "input" && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Input type</span>
                                        <select
                                            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                                            value={f.inputType ?? "text"}
                                            onChange={(e) => updateField(f.id, "inputType", e.target.value)}
                                        >
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="number">Number</option>
                                            <option value="tel">Tel</option>
                                            <option value="url">URL</option>
                                        </select>
                                    </div>
                                )}

                                {f.type === "inputNumber" && (
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-sm">Min</span>
                                        <Input
                                            className="w-28"
                                            placeholder="min"
                                            type="number"
                                            value={f.min ?? 0}
                                            onChange={(e) => updateField(f.id, "min", Number(e.target.value || 0))}
                                        />

                                        <span className="text-sm">Max</span>
                                        <Input
                                            className="w-28"
                                            placeholder="max"
                                            type="number"
                                            value={f.max ?? 100}
                                            onChange={(e) => updateField(f.id, "max", Number(e.target.value || 0))}
                                        />

                                        <span className="text-sm">Step</span>
                                        <Input
                                            className="w-28"
                                            placeholder="step (ex: 0.1)"
                                            type="number"
                                            inputMode="decimal"
                                            step="any"
                                            min={0}
                                            value={f.step ?? ""}
                                            onChange={(e) => {
                                                const v = e.currentTarget.value;
                                                updateField(f.id, "step", v === "" ? undefined : parseFloat(v));
                                            }}
                                        />

                                        <span className="text-sm">Decimal</span>
                                        <Input
                                            className="w-28"
                                            placeholder="precision decimal"
                                            type="number"
                                            value={f.precision ?? 0}
                                            onChange={(e) => updateField(f.id, "precision", Number(e.target.value || 0))}
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Allow Negative</span>
                                            <Switch checked={!!f.allowNegative} onCheckedChange={(v) => updateField(f.id, "allowNegative", !!v)} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Allow Decimal</span>
                                            <Switch checked={!!f.allowDecimal} onCheckedChange={(v) => updateField(f.id, "allowDecimal", !!v)} />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <span className="text-sm">Required</span>
                                    <Switch checked={f.required} onCheckedChange={(v) => updateField(f.id, "required", !!v)} />
                                </div>

                                <Button variant="ghost" size="icon" onClick={() => removeField(f.id)} aria-label="Remover">
                                    <Trash2Icon className="h-4 w-4" />
                                </Button>
                            </div>

                            {["select", "radio"].includes(f.type) && (
                                <div className="flex flex-wrap items-end gap-3">
                                    <Textarea
                                        className="min-w-[340px]"
                                        placeholder="Options (one per line)"
                                        value={draftOptions[f.id] ?? (f.options ?? []).join("\n")}
                                        onChange={(e) => setDraftOptions((prev) => ({ ...prev, [f.id]: e.target.value }))}
                                        onBlur={(e) => {
                                            updateField(f.id, "options", splitLines(e.target.value));
                                            setDraftOptions((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== f.id)));
                                        }}
                                    />
                                    {f.type === "select" && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Multi Options</span>
                                            <Switch checked={!!f.isMulti} onCheckedChange={(v) => updateField(f.id, "isMulti", !!v)} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {f.type === "tags" && <p className="text-xs text-muted-foreground">Tags uses the &lt;Tags /&gt; component (array of strings).</p>}

                            {f.type === "dropzone" && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <Input
                                        className="w-[260px]"
                                        placeholder='accept (ex: "image/*,.pdf")'
                                        value={f.accept ?? ""}
                                        onChange={(e) => updateField(f.id, "accept", e.target.value)}
                                    />
                                    <Input
                                        className="w-28"
                                        placeholder="maxFiles"
                                        type="number"
                                        value={f.maxFiles ?? 5}
                                        onChange={(e) => updateField(f.id, "maxFiles", Number(e.target.value || 0))}
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Multi</span>
                                        <Switch checked={!!f.isMulti} onCheckedChange={(v) => updateField(f.id, "isMulti", !!v)} />
                                    </div>
                                </div>
                            )}

                            {f.type === "slider" && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-sm">Min</span>
                                    <Input
                                        className="w-28"
                                        placeholder="min"
                                        type="number"
                                        value={f.min ?? 0}
                                        onChange={(e) => updateField(f.id, "min", Number(e.target.value || 0))}
                                    />

                                    <span className="text-sm">Max</span>
                                    <Input
                                        className="w-28"
                                        placeholder="max"
                                        type="number"
                                        value={f.max ?? 100}
                                        onChange={(e) => updateField(f.id, "max", Number(e.target.value || 0))}
                                    />

                                    <span className="text-sm">Step</span>
                                    <Input
                                        className="w-28"
                                        placeholder="step (ex: 0.1)"
                                        type="number"
                                        inputMode="decimal"
                                        step="any"
                                        min={0}
                                        value={f.step ?? ""}
                                        onChange={(e) => {
                                            const v = e.currentTarget.value;
                                            updateField(f.id, "step", v === "" ? undefined : parseFloat(v));
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    {fields.length === 0 && <p className="text-sm text-muted-foreground">No Fields.</p>}
                </Card>

                <Card className="p-4 space-y-6">
                    <h2 className="font-semibold">Preview</h2>
                    <div className="space-y-4">
                        {fields.map((f) => (
                            <div key={f.id} className="space-y-1">
                                <div className="text-sm font-medium">{f.label}</div>
                                <PreviewField field={f} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <CodeBlock title="Imports" code={code.imports} onCopy={() => copyToClipboard(code.imports)} />
                <CodeBlock title="Functions" code={code.functions} onCopy={() => copyToClipboard(code.functions)} />
                <CodeBlock title="Schema" code={code.schema} onCopy={() => copyToClipboard(code.schema)} />
                <CodeBlock title="Form Component" code={code.form} onCopy={() => copyToClipboard(code.form)} />
            </div>
        </div>
    );
}

function SelectType(props: { value: FieldType; onChange: (t: FieldType) => void }) {
    const TYPES: { value: FieldType; label: string }[] = [
        { value: "input", label: "Input" },
        { value: "inputNumber", label: "Input Number" },
        { value: "textarea", label: "Textarea" },
        { value: "password", label: "Password" },
        { value: "checkbox", label: "Checkbox" },
        { value: "switch", label: "Switch" },
        { value: "radio", label: "RadioGroup" },
        { value: "select", label: "Select / Select" },
        { value: "tags", label: "Tags" },
        { value: "datepicker", label: "DatePicker" },
        { value: "dropzone", label: "Dropzone" },
        { value: "slider", label: "Slider" },
        { value: "inputOtp", label: "InputOTP" },
        { value: "markdown", label: "Markdown" },
    ];
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm">Type</span>
            <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={props.value} onChange={(e) => props.onChange(e.target.value as FieldType)}>
                {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                        {t.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function PreviewField({ field }: { field: Field }) {
    switch (field.type) {
        case "input":
            return <Input placeholder={field.label} />;
        case "inputNumber":
            return (
                <InputNumber
                    placeholder={field.label}
                    min={field.min}
                    max={field.max}
                    step={field.step ?? 1}
                    precision={field.precision ?? 0}
                    allowNegative={field.allowNegative ?? true}
                    allowDecimal={field.allowDecimal ?? true}
                />
            );
        case "textarea":
            return <Textarea placeholder={field.label} />;
        case "password":
            return <Password placeholder={field.label} />;
        case "checkbox":
            return <Checkbox />;
        case "switch":
            return <Switch />;
        case "radio":
            return (
                <RadioGroup>
                    {(field.options ?? []).map((opt) => (
                        <RadioGroupItem key={opt} value={opt} id={opt} />
                    ))}
                </RadioGroup>
            );
        case "select":
            if (field.isMulti) {
                return <Select options={(field.options ?? []).map((o) => ({ value: o, label: o }))} isMulti={true} value={[]} onChange={() => {}} />;
            } else {
                return <Select options={(field.options ?? []).map((o) => ({ value: o, label: o }))} isMulti={false} value={null} onChange={() => {}} />;
            }
        case "tags":
            return <Tags value={["alpha"]} onValueChange={() => {}} />;
        case "datepicker":
            return <DatePicker />;
        case "dropzone":
            return <Dropzone multiple={!!field.isMulti} accept={["image/*", ".pdf", ".zip"]} maxFiles={1} maxSizeMB={20} />;
        case "slider":
            return <UiSlider defaultValue={[field.min ?? 0]} min={field.min ?? 0} max={field.max ?? 100} step={field.step ?? 1} />;
        case "inputOtp":
            return (
                <InputOTP maxLength={6} value="" onChange={() => {}}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            );
        case "markdown":
            return <MarkdownEditor value={""} onChange={() => {}} />;
        default:
            return null;
    }
}

function CodeBlock({ title, code, onCopy }: { title: string; code: string; onCopy: () => void }) {
    return (
        <div className="rounded-lg border border-dashed bg-accent overflow-hidden">
            <div className="flex items-center justify-between bg-muted/40 px-3 py-2">
                <div className="text-sm font-medium">{title}</div>
                <Button variant="ghost" size="sm" onClick={onCopy}>
                    <CopyIcon />
                </Button>
            </div>
            <pre className="p-3 text-xs overflow-auto max-h-96">
                <code>{code}</code>
            </pre>
        </div>
    );
}

function safeVar(s: string) {
    return (s || "")
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .replace(/^(\d)/, "_$1")
        .slice(0, 50);
}

function splitLines(s: string): string[] {
    return s
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);
}

function zodForField(f: Field): string {
    let base = "z.any()";
    switch (f.type) {
        case "input":
        case "textarea":
        case "password":
        case "inputOtp":
            base = "z.string()";
            break;
        case "markdown":
            base = "z.string()";
            break;
        case "checkbox":
        case "switch":
            base = "z.boolean()";
            break;
        case "radio":
            base = f.options?.length ? `z.enum([${f.options.map((o) => `"${o}"`).join(", ")}])` : "z.string()";
            break;
        case "select":
            if (f.isMulti) base = "z.array(z.string())";
            else base = "z.string()";
            break;
        case "tags":
            base = "z.array(z.string())";
            break;
        case "datepicker":
            base = "z.date()";
            break;
        case "dropzone":
            base = f.isMulti ? "z.array(z.instanceof(File))" : "z.instanceof(File).or(z.undefined())";
            break;
        case "inputNumber":
        case "slider":
            base = "z.number()";
            break;
    }
    if (!f.required) base += ".optional()";
    return base;
}

function defaultForField(f: Field): string {
    switch (f.type) {
        case "input":
        case "textarea":
        case "password":
        case "inputOtp":
        case "markdown":
            return f.required ? `""` : `""`;
        case "checkbox":
        case "switch":
            return "false";
        case "radio":
            return f.options?.length ? `"${f.options[0]}"` : `""`;
        case "select":
            return f.isMulti ? "[]" : `""`;
        case "tags":
            return "[]";
        case "datepicker":
            return "null";
        case "dropzone":
            return f.isMulti ? "[]" : "undefined";
        case "inputNumber":
        case "slider":
            return String(f.min ?? 0);
        default:
            return "undefined";
    }
}

function jsxForField(f: Field): string {
    const n = f.name;
    const L = f.label || n;
    switch (f.type) {
        case "input":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <Input {...field} type="${f.inputType ?? "text"}" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "inputNumber":
            return `<FormField
 control={form.control}
 name="${n}"
 render={({ field }) => (
   <FormItem>
     <FormLabel>${L}</FormLabel>
     <FormControl>
       <InputNumber
         {...field}
         min={${f.min ?? 0}}
         max={${f.max ?? 100}}
         step={${f.step ?? 1}}
         precision={${f.precision ?? 0}}
         allowNegative={${f.allowNegative ?? true}}
         allowDecimal={${f.allowDecimal ?? true}}
       />
     </FormControl>
     <FormMessage />
   </FormItem>
 )}
/>`;

        case "textarea":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <Textarea {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "password":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <Password {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "checkbox":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <div className="flex items-center gap-2">
        <FormControl>
          <Checkbox {...field} />
        </FormControl>
        <FormLabel className="!mt-0">${L}</FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "switch":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem className="flex items-center justify-between rounded-lg border p-3">
      <div className="space-y-0.5">
        <FormLabel>${L}</FormLabel>
      </div>
      <FormControl>
        <Switch {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "radio": {
            const opts = (f.options?.length ? f.options : ["A", "B"]).map((o) => `"${o}"`).join(", ");
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <RadioGroup {...field} >
          {[${opts}].map((o) => (
            <div key={o} className="flex items-center gap-2">
              <RadioGroupItem id={\`${n}-\${o}\`} value={o} />
              <label htmlFor={\`${n}-\${o}\`} className="text-sm">{o}</label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;
        }

        case "select": {
            const opts = (f.options?.length ? f.options : []).map((o) => `{ value: "${o}", label: "${o}" }`).join(", ");
            if (f.isMulti) {
                return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <Select
          options={[${opts}]}
          isMulti
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;
            }
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <Select
          options={[${opts}]}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;
        }

        case "tags":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <Tags {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "datepicker":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <DatePicker {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "dropzone":
            if (f.isMulti) {
                return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <Dropzone
          multiple
          accept="${f.accept ?? ""}"
          maxFiles={${f.maxFiles ?? 5}}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;
            }
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <Dropzone
          multiple={false}
          accept="${f.accept ?? ""}"
          maxFiles={1}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "slider":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
      <FormControl>
        <UiSlider
          min={${f.min ?? 0}}
          max={${f.max ?? 100}}
          step={${f.step ?? 1}}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "inputOtp":
            return `<FormField
  control={form.control}
  name="${n}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${L}</FormLabel>
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
      <FormMessage />
    </FormItem>
  )}
/>`;

        case "markdown":
            return `<FormField
control={form.control}
name="${n}"
render={({ field }) => (
    <FormItem>
        <FormLabel>${L}</FormLabel>
        <FormControl>
            <MarkdownEditor name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} className="w-full" />
        </FormControl>
        <FormMessage />
    </FormItem>
)}
/>`;
        default:
            return "";
    }
}

function generateCode({ formName, endpoint, fields }: { formName: string; endpoint: string; fields: Field[] }) {
    const safeName = formName?.trim() || "Form";

    const schemaLines = fields.map((f) => `  ${safeVar(f.name)}: ${zodForField(f)},`);
    const defaultsLines = fields.map((f) => `    ${safeVar(f.name)}: ${defaultForField(f)},`);
    const jsxBlocks = fields.map((f) => jsxForField(f)).join("\n\n");

    // Get unique imports based on used field types
    const usedTypes = new Set(fields.map((f) => f.type));
    const imports = [];

    // Base imports
    imports.push('import { api } from "@/lib/api/fetcher";');
    imports.push('import { toast } from "sonner";');
    imports.push('import { useForm } from "react-hook-form";');
    imports.push('import { zodResolver } from "@hookform/resolvers/zod";');
    imports.push('import { z } from "zod";');
    imports.push('import { Button } from "@/components/ui/button";');
    imports.push('import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";');

    // Conditional imports based on used components
    if (usedTypes.has("input")) imports.push('import { Input } from "@/components/ui/input";');
    if (usedTypes.has("inputNumber")) imports.push('import { InputNumber } from "@/components/ui/input-number";');
    if (usedTypes.has("textarea")) imports.push('import { Textarea } from "@/components/ui/textarea";');
    if (usedTypes.has("password")) imports.push('import { Password } from "@/components/ui/password";');
    if (usedTypes.has("checkbox")) imports.push('import { Checkbox } from "@/components/ui/checkbox";');
    if (usedTypes.has("switch")) imports.push('import { Switch } from "@/components/ui/switch";');
    if (usedTypes.has("slider")) imports.push('import { Slider as UiSlider } from "@/components/ui/slider";');
    if (usedTypes.has("radio")) imports.push('import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";');
    if (usedTypes.has("select")) imports.push('import { Select } from "@/components/ui/select";');
    if (usedTypes.has("datepicker")) imports.push('import { DatePicker } from "@/components/ui/datePicker";');
    if (usedTypes.has("dropzone")) imports.push('import { Dropzone } from "@/components/ui/dropzone";');
    if (usedTypes.has("tags")) imports.push('import { Tags } from "@/components/ui/tags";');
    if (usedTypes.has("inputOtp")) imports.push('import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";');
    if (usedTypes.has("markdown")) imports.push('import { MarkdownEditor } from "@/components/ui/markdown-editor";');

    const functions = `const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log(values);

    api.post("${endpoint}")
       .json(values)
       .then(() => {
            toast.success("Form submitted successfully!");
            form.reset();
       })
       .catch(() => {
            toast.error("Failed to submit form");
       });
};

const form = useForm<z.infer<typeof ${safeName}Schema>>({
    resolver: zodResolver(${safeName}Schema),
    defaultValues: {
${defaultsLines.join("\n")}
    },
});`;

    const schema = `const ${safeName}Schema = z.object({
${schemaLines.join("\n")}
});

export type ${safeName}Values = z.infer<typeof ${safeName}Schema>;`;

    const form = `<Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
${jsxBlocks
    .split("\n")
    .map((l) => "        " + l)
    .join("\n")}
        <Button type="submit">Submit</Button>
    </form>
</Form>`;

    return {
        imports: imports.join("\n"),
        functions,
        schema,
        form,
    };
}
