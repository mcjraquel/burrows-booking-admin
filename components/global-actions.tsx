"use client";

import { Store, Menu, Settings } from "lucide-react";
import prismadb from "@/lib/prismadb";
import { AppUser } from "@prisma/client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface GlobalActionProps {
    appUser: AppUser;
}

export default function GlobalActions({ appUser }: GlobalActionProps) {
    const router = useRouter();

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Menu className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    {/* <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={addBranchModal.onOpen}>
                            <Store className="mr-2 h-4 w-4" />
                            <span>Add Branch</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup> */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={() => {
                                router.push("/manage");
                            }}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>System Settings</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
