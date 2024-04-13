import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request, params: { id: string }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.id) {
            const services = await prismadb.service.findMany();
            return NextResponse.json(services);
        } else {
            const service = await prismadb.service.findFirst({
                where: {
                    id: params.id,
                },
            });

            if (!service) {
                return new NextResponse("Service not found", { status: 404 });
            }

            return NextResponse.json(service);
        }
    } catch (error) {
        console.log("[SERVICES GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
