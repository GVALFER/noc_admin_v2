"use client";

import { Modal } from "@/components/ui/modal";
import { NextActions } from "@/components/ui/nextActions";
import { useSession } from "@/providers/sessionProvider";
import { PencilLine, Trash } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { ActionsAdmin } from "../types/actions";
import UpdateAccount from "./adminUpdate";
import DeleteAccount from "./adminDelete";

const Actions = ({ data, helpers }: ActionsAdmin) => {
    const [open, setOpen] = useState(false);
    const [del, setDelete] = useState(false);

    const session = useSession();

    const handleEdit = useCallback(() => setOpen(true), []);
    const handleDelete = useCallback(() => setDelete(true), []);

    const items = useMemo(
        () => [
            { label: "Edit", icon: <PencilLine />, onClick: handleEdit },
            {
                label: "Delete",
                icon: <Trash />,
                variant: "destructive",
                disabled: data.id === session?.id,
                onClick: handleDelete,
            },
        ],
        [handleEdit, handleDelete, data.id, session?.id],
    );

    return (
        <>
            <NextActions className="w-52" items={items} />
            {open && (
                <Modal size="lg" dismissible={false} onOpenChange={setOpen} open={open} header="Edit Account" description="Edit the details of the selected admin account.">
                    <UpdateAccount data={data} helpers={helpers} />
                </Modal>
            )}
            {del && <DeleteAccount data={data} open={del} setOpen={setDelete} />}
        </>
    );
};

export default memo(Actions);
