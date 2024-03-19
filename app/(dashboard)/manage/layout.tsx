import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import GlobalSettingsRolesPage from "./(routes)/roles/page";

export default async function GlobalSettingsLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { branchId: string; roleId: string };
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
        <div className="min-w-96">
            <Navbar />
            <div className="mx-24">
                <div className="flex items-center justify-between">
                    <Heading
                        className="my-4"
                        title="Global Settings"
                        description="Manage global preferences"
                        variant="heading"
                    />
                </div>
                {/* <Separator /> */}
                <Tabs defaultValue="system" className="w-full">
                    <TabsList className="grid-cols-2 my-4">
                        <TabsTrigger className="min-w-28" value="system">
                            System
                        </TabsTrigger>
                        <TabsTrigger className="min-w-28" value="roles">
                            Roles
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="system">System</TabsContent>
                    <TabsContent value="roles">
                        <GlobalSettingsRolesPage />
                    </TabsContent>
                </Tabs>
                {/* {children} */}
            </div>
        </div>
    );
}
