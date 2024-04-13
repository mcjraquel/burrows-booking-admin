import prismadb from "@/lib/prismadb";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/bookings-columns";

interface DashboardPageProps {
    params: { branchId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    const branch = await prismadb.branch.findFirst({
        where: {
            id: params.branchId,
        },
    });

    const bookings = await prismadb.booking.findMany({
        where: {
            branchId: params.branchId,
        },
    });

    return (
        <div className="mx-24 mt-4">
            <Card className="w-full p-4 min-w-96 py-6 px-5">
                <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>
                        Manage bookings and schedule
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={bookings} />
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;
