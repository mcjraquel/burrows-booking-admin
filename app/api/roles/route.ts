import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { Role } from "@prisma/client";

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

        const role = await prismadb.role.create({
            data: {
                name,
                createdBy: userId,
            },
        });

        return NextResponse.json(role);
    } catch (error) {
        console.log("[ROLES POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request, params: { id: string }) {
    try {
        if (!params.id) {
            const roles = await prismadb.role.findMany();
            return NextResponse.json(roles);
        } else {
            const role = await prismadb.role.findFirst({
                where: {
                    id: params.id,
                },
            });

            if (!role) {
                return new NextResponse("Role not found", { status: 404 });
            }

            return NextResponse.json(role);
        }
    } catch (error) {
        console.log("[ROLES GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
