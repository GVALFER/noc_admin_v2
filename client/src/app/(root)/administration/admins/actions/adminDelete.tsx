"use client";

import { Confirmation } from "@/components/ui/confirmation";
import { api, parseError } from "@/lib/api/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteAccountProps } from "../types/admin";

const DeleteAccount = ({ data, open, setOpen }: DeleteAccountProps) => {
    const query = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async () => {
            return api.delete("users/account", { json: { id: data.id } }).json();
        },
        onSuccess: () => {
            toast.success("Admin account deleted successfully!");
            query.invalidateQueries({ queryKey: ["users"] });
            setOpen(false);
        },
        onError: (err) => {
            toast.error(parseError(err).message);
        },
    });

    return (
        <>
            <Confirmation open={open} setOpen={setOpen} onConfirm={mutate} title={`Delete Admin Account: ${data.name}`} variant="destructive" isCode={false}>
                <div>Are you sure you want to delete this admin?</div>
                <div className="text-destructive">This action cannot be undone.</div>
            </Confirmation>
        </>
    );
};

export default DeleteAccount;
