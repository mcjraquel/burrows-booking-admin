import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            branchId,
            bookingTime,
            bookingName,
            bookingEmail,
            serviceId,
            assigneeId,
            amount,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!branchId) {
            return new NextResponse("Branch is required", { status: 400 });
        }

        const booking = await prismadb.booking.create({
            data: {
                branchId,
                bookingTime,
                bookingName,
                bookingEmail,
                serviceId,
                assigneeId,
                amount,
                status: "pending",
                createdBy: userId,
            },
        });

        return NextResponse.json(booking);
    } catch (error) {
        console.log("[BOOKINGS POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request, params: { branchId: string }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.branchId) {
            const bookings = await prismadb.booking.findMany();
            return NextResponse.json(bookings);
        } else {
            const branchBookings = await prismadb.booking.findMany({
                where: {
                    id: params.branchId,
                },
            });

            return NextResponse.json(branchBookings);
        }
    } catch (error) {
        console.log("[BOOKINGS GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
