"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, Check, Plus } from "lucide-react";
import { useParams } from "next/navigation";

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

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

export type SwitcherItem = {
    label: string;
    value: string;
};

interface SwitcherProps extends PopoverTriggerProps {
    onOptionSelect: () => void;
    setValue: (value: string) => void;
    items: SwitcherItem[];
}

export const Switcher: React.FC<SwitcherProps> = ({
    className,
    onOptionSelect,
    setValue,
    items = [],
}) => {
    // const params = useParams();

    const [selectedItem, setSelectedItem] = useState<SwitcherItem>();
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select an option"
                    className={cn("w-[200px] justify-between", className)}
                >
                    {selectedItem?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search" />
                        <CommandEmpty>No results.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    onSelect={() => {
                                        setOpen(false);
                                        setSelectedItem(item);
                                        console.log(selectedItem);
                                        setValue(item.value);
                                        onOptionSelect();
                                    }}
                                    className="text-sm"
                                >
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedItem?.value === item.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    {/* <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                }}
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Add Branch
                            </CommandItem>
                        </CommandGroup>
                    </CommandList> */}
                </Command>
            </PopoverContent>
        </Popover>
    );
};
