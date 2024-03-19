import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { branchId: string };
}) {
    const { userId } = auth();

    if (!userId) {
        redirect("sign-in/");
    }

    const branch = await prismadb.branch.findFirst({
        where: {
            id: params.branchId,
            // createdBy: userId,
        },
    });

    if (!branch) {
        redirect("/");
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
