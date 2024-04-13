import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

import { BranchSettingsForm } from "./components/branch-settings-form";

interface BranchSettingsPageProps {
    params: {
        branchId: string;
    };
}

const BranchSettingsPage: React.FC<BranchSettingsPageProps> = async ({
    params,
}) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
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
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6 mx-24 mt-4">
                <BranchSettingsForm initialData={branch} />
            </div>
        </div>
    );
};

export default BranchSettingsPage;
