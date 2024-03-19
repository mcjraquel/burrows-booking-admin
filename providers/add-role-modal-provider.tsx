"use client";

import { useEffect, useState } from "react";
import { AddRoleModal } from "@/components/modals/add-role-modal";

export const AddRoleModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AddRoleModal />
        </>
    );
};
