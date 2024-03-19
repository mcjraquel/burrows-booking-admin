import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
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

        const branch = await prismadb.branch.create({
            data: {
                name,
                createdBy: userId,
            },
        });

        return NextResponse.json(branch);
    } catch (error) {
        console.log("[BRANCHES POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request, params: { id: string }) {
    try {
        if (!params.id) {
            const branches = await prismadb.branch.findMany();
            return NextResponse.json(branches);
        } else {
            const branch = await prismadb.branch.findFirst({
                where: {
                    id: params.id,
                },
            });

            if (!branch) {
                return new NextResponse("Branch not found", { status: 404 });
            }

            return NextResponse.json(branch);
        }
    } catch (error) {
        console.log("[BRANCHES GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
