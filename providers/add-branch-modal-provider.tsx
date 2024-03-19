"use client";

import { AddBranchModal } from "@/components/modals/add-branch-modal";
import { useEffect, useState } from "react";

export const AddBranchModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AddBranchModal />
        </>
    );
};
