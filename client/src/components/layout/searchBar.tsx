import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchBar = () => {
    return (
        <div className="w-full max-w-md">
            <Input className="w-full" endContent={<Search className="size-4" />} placeholder="Search..." />
        </div>
    );
};
