"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAddRoleModal } from "@/hooks/use-add-role-modal";
import { Modal } from "@/components/ui/modal";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().min(1),
});

export const AddRoleModal = () => {
    const addRoleModal = useAddRoleModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            await axios.post("/api/roles", values);

            toast.success("Role created successfully.");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            addRoleModal.onClose();
        }
    };

    return (
        <Modal
            title="Add Role"
            description="Add role to manage permissions"
            isOpen={addRoleModal.isOpen}
            onClose={addRoleModal.onClose}
        >
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Administrator"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-6 space-x-2 flex items-center justify-end">
                            <Button
                                disabled={loading}
                                variant="outline"
                                onClick={addRoleModal.onClose}
                            >
                                Cancel
                            </Button>
                            <Button disabled={loading} type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};
