import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

export default async function SetupLayout({
    children,
}: // params,
{
    children: React.ReactNode;
    // params: { branchId: string };
}) {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const branch = await prismadb.branch.findFirst({
        // where: {
        //     createdBy: userId,
        // },
    });

    if (branch) {
        redirect(`/${branch.id}`);
    }

    return <>{children}</>;
}
