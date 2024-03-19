import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    {params}: {params: {branchId: string}}
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.branchId) {
            return new NextResponse("Branch ID is required", { status: 400 });
        }

        const branch = await prismadb.branch.updateMany({
            where: {
                id: params.branchId,
            }, data: {
                name
            }
        });

        return NextResponse.json(branch);
    } catch (error) {
        console.log("[STORE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    {params}: {params: {branchId: string}}
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.branchId) {
            return new NextResponse("Branch ID is required", { status: 400 });
        }

        const branch = await prismadb.branch.deleteMany({
            where: {
                id: params.branchId,
            }
        });

        return NextResponse.json(branch);
    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}