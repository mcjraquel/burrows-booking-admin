"use client";

import { Booking } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Booking = {
//     id: string;
//     branchId: string;
//     bookingTime: Date;
//     bookingName: string;
//     bookingEmail: string;
//     assigneeId: string;
//     serviceId: string;
//     status: "pending" | "processing" | "success" | "failed";
//     amount: number;
// };

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "branchId",
        header: "Branch",
    },
    {
        accessorKey: "serviceId",
        header: "Service",
    },
    {
        accessorKey: "bookingTime",
        header: "Booking Time",
    },
    {
        accessorKey: "bookingName",
        header: "Name",
    },
    {
        accessorKey: "bookingEmail",
        header: "Email",
    },
    {
        accessorKey: "assigneeId",
        header: "Assignee",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
];
