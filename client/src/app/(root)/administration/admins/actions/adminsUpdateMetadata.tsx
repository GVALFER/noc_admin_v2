import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { MetadataFormProps } from "../types/admins";

const UserMetadataForm = ({ initialMetadata = {}, onChange }: MetadataFormProps) => {
    const [metadata, setMetadata] = useState<Record<string, string>>(initialMetadata);
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

    const handleAdd = () => {
        if (newKey.trim() && newValue.trim()) {
            const updated = { ...metadata, [newKey]: newValue };
            setMetadata(updated);
            setNewKey("");
            setNewValue("");
            onChange?.(updated);
        }
    };

    const handleEdit = (key: string, value: string) => {
        const updated = { ...metadata, [key]: value };
        setMetadata(updated);
        onChange?.(updated);
    };

    const handleRemove = (key: string) => {
        const updated = { ...metadata };
        delete updated[key];
        setMetadata(updated);
        onChange?.(updated);
    };

    return (
        <div className="space-y-4">
            <div>
                {Object.entries(metadata).map(([key, value]) => (
                    <div key={key} className="flex gap-2 items-center mb-2">
                        <Input value={key} readOnly className="grow basis-1/2" />
                        <Input value={value} onChange={(e) => handleEdit(key, e.target.value)} className="grow basis-1/2" />
                        <Button type="button" variant="outline" onClick={() => handleRemove(key)} size="icon" className="basis-[40px] flex-shrink-0">
                            <Trash2 size={14} />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Input placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="grow basis-1/2" />
                <Input placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="grow basis-1/2" />
                <Button variant="outline" type="button" onClick={handleAdd} size="icon" className="basis-[40px] flex-shrink-0">
                    <Plus size={18} />
                </Button>
            </div>
        </div>
    );
};

export default UserMetadataForm;
