"use client";

import { Confirmation } from "@/components/ui/confirmation";
import { api } from "@/lib/api/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteUserProps } from "../types/admins";

const DeleteAdmin = ({ data, open, setOpen }: DeleteUserProps) => {
    const query = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => {
            return api.delete("users/admin", { json: { id: data.id } }).json();
        },
        onSuccess: () => {
            toast.success("Admin deleted successfully!");
            query.invalidateQueries({ queryKey: ["users"] });
            setOpen(false);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return (
        <>
            <Confirmation open={open} setOpen={setOpen} onConfirm={mutate} title={`Delete Admin: ${data.name}`} variant="destructive" isCode={true}>
                <div>Are you sure you want to delete this admin?</div>
                <div className="text-destructive">This action cannot be undone.</div>
            </Confirmation>
        </>
    );
};

export default DeleteAdmin;
