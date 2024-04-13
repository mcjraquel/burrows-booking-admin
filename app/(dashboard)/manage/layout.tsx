import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import Navbar from "@/components/navbar";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import GlobalSettingsRolesPage from "./(routes)/components/roles-tab";

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
        },
    });

    if (!branch) {
        redirect("/");
    }

    return (
        <div className="min-w-96">
            <Navbar />
            <div className="mx-24 mt-4">
                <div className="flex items-center justify-between">
                    <Heading
                        className="my-4"
                        title="Global Settings"
                        description="Manage global preferences"
                        variant="heading"
                    />
                </div>
                <Tabs defaultValue="system" className="w-full">
                    <TabsList className="grid-cols-2 my-4">
                        <TabsTrigger className="min-w-28" value="system">
                            System
                        </TabsTrigger>
                        <TabsTrigger className="min-w-28" value="roles">
                            Roles
                        </TabsTrigger>
                        <TabsTrigger className="min-w-28" value="services">
                            Services
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="system">System</TabsContent>
                    <TabsContent value="roles">
                        <GlobalSettingsRolesPage />
                    </TabsContent>
                    <TabsContent value="services"></TabsContent>
                </Tabs>
                {children}
            </div>
        </div>
    );
}
