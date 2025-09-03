"use client";

import { Modal } from "@/components/ui/modal";
import { NextActions } from "@/components/ui/nextActions";
import { useSession } from "@/providers/sessionProvider";
import { PencilLine, Trash, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import UpdateUser from "./adminsUpdate";
import DeleteAdmin from "./adminsDelete";
import { ActionsAdmins } from "../types/actions";

const Actions = ({ data, helpers }: ActionsAdmins) => {
    const [open, setOpen] = useState(false);
    const [del, setDelete] = useState(false);

    const router = useRouter();
    const session = useSession();

    const handleViewDetails = useCallback(() => router.push(`/administration/admins/${data.id}`), [router, data.id]);
    const handleEdit = useCallback(() => setOpen(true), []);
    const handleDelete = useCallback(() => setDelete(true), []);

    const items = useMemo(
        () => [
            { label: "View Details", icon: <User2 />, onClick: handleViewDetails },
            { label: "Edit", icon: <PencilLine />, onClick: handleEdit },
            {
                label: "Delete",
                icon: <Trash />,
                variant: "destructive",
                disabled: data.accounts.some((a: { id: string }) => a.id === session?.id),
                onClick: handleDelete,
            },
        ],
        [handleViewDetails, handleEdit, handleDelete, data.accounts, session?.id],
    );

    return (
        <>
            <NextActions className="w-52" items={items} />
            {open && (
                <Modal size="lg" dismissible={false} onOpenChange={setOpen} open={open} header="Edit Admin" description="Edit the details of the selected admin.">
                    <UpdateUser data={data} helpers={helpers} setOpenModal={setOpen} />
                </Modal>
            )}
            {del && <DeleteAdmin data={data} open={del} setOpen={setDelete} />}
        </>
    );
};

export default memo(Actions);
