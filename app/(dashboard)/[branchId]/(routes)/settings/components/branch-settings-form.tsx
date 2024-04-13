"use client";

import * as z from "zod";
import axios from "axios";
import { Branch, Service } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { getServices } from "@/lib/db-utils";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Checkbox } from "@/components/ui/checkbox";

interface BranchSettingsFormProps {
    initialData: Branch;
}

type FormattedItem = {
    label: string;
    value: string;
};

const formSchema = z.object({
    name: z.string().min(1),
    services: z.array(z.string()),
});

type BranchSettingsFormValues = z.infer<typeof formSchema>;

export const BranchSettingsForm: React.FC<BranchSettingsFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [services, setServices] = useState<FormattedItem[]>([]);

    useEffect(() => {
        getServices().then((services) => {
            setServices(
                services.map((service) => ({
                    label: service.name,
                    value: service.id,
                }))
            );
        });
    }, []);

    const form = useForm<BranchSettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: BranchSettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/branches/${params.branchId}`, data);
            router.refresh();
            toast.success("Branch settings updated.");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/branches/${params.branchId}`);
            router.refresh();
            router.push("/");
            toast.success("Branch deleted.");
        } catch (error) {
            toast.error(
                "Make sure you removed all services and bookings before deleting the branch."
            );
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title="Branch Settings"
                    description="Manage branch preferences"
                />
                <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Branch name"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="services"
                            render={() => (
                                <FormItem>
                                    <div>
                                        <FormLabel>Services</FormLabel>
                                        <FormDescription>
                                            Select branch services
                                        </FormDescription>
                                    </div>
                                    {services.map((service) => (
                                        <FormField
                                            key={service.id}
                                            control={form.control}
                                            name="services"
                                            render={({ field }) => (
                                                <FormItem
                                                    key={service.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(
                                                                service.id
                                                            )}
                                                            onCheckedChange={(
                                                                checked
                                                            ) => {
                                                                return checked
                                                                    ? field.onChange(
                                                                          [
                                                                              ...field.value,
                                                                              service.id,
                                                                          ]
                                                                      )
                                                                    : field.onChange(
                                                                          field.value?.filter(
                                                                              (
                                                                                  value
                                                                              ) =>
                                                                                  value !==
                                                                                  service.id
                                                                          )
                                                                      );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>
                                                        {service.name}
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        variant="destructive"
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                    >
                        Save changes
                    </Button>
                </form>
            </Form>
        </>
    );
};
