import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
    params: { branchId: string }
};

const DashboardPage: React.FC<DashboardPageProps> = async ({params}) => {
    const branch = await prismadb.branch.findFirst({
        where: {
            id: params.branchId,
        }
    });

    return (
        <div>
            Active Store: {branch?.name}
        </div>
    );
}

export default DashboardPage;