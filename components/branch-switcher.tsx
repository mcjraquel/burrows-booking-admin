"use client";

import { useState } from "react";
import { Branch } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Store, ChevronsUpDown, Check, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandList,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command";
import { useAddBranchModal } from "@/hooks/use-add-branch-modal";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

interface BranchSwitcherProps extends PopoverTriggerProps {
    items: Branch[];
}

export default function BranchSwitcher({
    className,
    items = [],
}: BranchSwitcherProps) {
    const addBranchModal = useAddBranchModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const currentBranch = formattedItems.find(
        (branch) => branch.value === params.branchId
    );

    if (!currentBranch) {
        return null;
    }

    const [open, setOpen] = useState(false);

    const onStoreSelect = (branch: { value: string; label: string }) => {
        setOpen(false);
        router.push(`/${branch.value}`);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a branch"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <Store className="mr-2 h-4 w-4" />
                    {currentBranch?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search branch..." />
                        <CommandEmpty>No branch found.</CommandEmpty>
                        <CommandGroup heading="Branches">
                            {formattedItems.map((branch) => (
                                <CommandItem
                                    key={branch.value}
                                    onSelect={() => onStoreSelect(branch)}
                                    className="text-sm"
                                >
                                    <Store className="mr-2 h-4 w-4" />
                                    {branch.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentBranch?.value ===
                                                branch.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    addBranchModal.onOpen();
                                }}
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Add Branch
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
