import { auth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

import { MainNav } from "@/components/main-nav";
import BranchSwitcher from "@/components/branch-switcher";
import GlobalActions from "@/components/global-actions";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default async function NavBar() {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const appUser = await prismadb.appUser.findFirst({
        where: {
            authUserId: userId,
        },
    });

    const branches = await prismadb.branch.findMany();

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <Button variant="link">
                    <Link href="/">Home</Link>
                </Button>
                <BranchSwitcher items={branches} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <ModeToggle />
                    <GlobalActions appUser={appUser} />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
}
