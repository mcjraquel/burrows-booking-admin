import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            roleId,
            branchId,
            // view_analytics,
            // manage_roles,
            // manage_users,
            // view_dashboard,
            // manage_schedule,
            permissions,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!roleId) {
            return new NextResponse("Role is required", { status: 400 });
        }

        const permissionSet = await prismadb.permissionSet.create({
            data: {
                roleId,
                branchId,
                permissions,
                // {
                //     view_analytics,
                //     manage_roles,
                //     manage_users,
                //     view_dashboard,
                //     manage_schedule,
                // },
                createdBy: userId,
            },
        });

        return NextResponse.json(permissionSet);
    } catch (error) {
        console.log("[PERMISSION_SETS POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { roleId, branchId, permissions } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!roleId) {
            return new NextResponse("Role is required", { status: 400 });
        }

        const permissionSet = await prismadb.permissionSet.updateMany({
            where: {
                roleId,
                branchId,
            },
            data: {
                permissions,
            },
        });

        return NextResponse.json(permissionSet);
    } catch (error) {
        console.log("[PERMISSION_SETS PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const permissionSets = await prismadb.permissionSet.findMany();
        return NextResponse.json(permissionSets);
    } catch (error) {
        console.log("[PERMISSION_SETS GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
