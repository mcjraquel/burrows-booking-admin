"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { getBranches, getPermissionSets, getRoles } from "@/lib/db-utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AddRoleModal } from "@/components/modals/add-role-modal";
import { useAddBranchModal } from "@/hooks/use-add-branch-modal";
import { useAddRoleModal } from "@/hooks/use-add-role-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, snakeCase } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { TabsContent } from "@/components/ui/tabs";

interface GlobalSettingsRolesPageProps {}

const formSchema = z.object({
    roleId: z.string(),
    branchId: z.string(),
    // view_analytics: z.boolean(),
    // manage_roles: z.boolean(),
    // manage_users: z.boolean(),
    // view_dashboard: z.boolean(),
    // manage_schedule: z.boolean(),
    permissions: z.array(z.string()),
});

type GlobalSettingsRolesFormValues = z.infer<typeof formSchema>;

type FormattedItem = {
    label: string;
    value: string;
};

type FormattedPermissionSet = {
    roleId: string;
    branchId: string;
    permissions: string[];
};

const GlobalSettingsRolesPage: React.FC<
    GlobalSettingsRolesPageProps
> = ({}) => {
    const router = useRouter();

    const addRoleModal = useAddRoleModal();
    const addBranchModal = useAddBranchModal();

    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<FormattedItem[]>([]);
    const [branches, setBranches] = useState<FormattedItem[]>([]);
    const [permissionSets, setPermissionSets] = useState<
        FormattedPermissionSet[]
    >([]);

    useEffect(() => {
        getRoles().then((roles) => {
            setRoles(
                roles.map((role) => ({
                    label: role.name,
                    value: role.id,
                }))
            );
        });

        getBranches().then((branches) => {
            setBranches(
                branches.map((role) => ({
                    label: role.name,
                    value: role.id,
                }))
            );
        });

        getPermissionSets().then((permissionSets) => {
            setPermissionSets(
                permissionSets.map((permissionSet) => ({
                    roleId: permissionSet.roleId,
                    branchId: permissionSet.branchId,
                    permissions: permissionSet.permissions,
                }))
            );
        });
    }, []);

    const form = useForm<GlobalSettingsRolesFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            roleId: "",
            branchId: "",
            // view_dashboard: true,
            // view_analytics: false,
            // manage_roles: false,
            // manage_users: false,
            // manage_schedule: false,
            permissions: [],
        },
    });

    const onSubmit = async (data: GlobalSettingsRolesFormValues) => {
        try {
            setLoading(true);

            console.log(data);
            console.log(permissionSets);

            if (!data.roleId) {
                await toast.error("Role is required.");
                return;
            }

            const existingPermissionSet = permissionSets.find(
                (permissionSet) =>
                    permissionSet.roleId === data.roleId &&
                    permissionSet.branchId === data.branchId
            );
            console.log(existingPermissionSet);

            if (existingPermissionSet) {
                await axios.patch("/api/permission-sets", data);
            } else {
                await axios.post("/api/permission-sets", data);
            }

            router.refresh();

            toast.success("Role updated successfully.");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TabsContent value="roles">
            <Card className="w-full p-4 min-w-96 py-6 px-5">
                <AddRoleModal />
                <CardHeader>
                    <CardTitle>Manage Roles</CardTitle>
                    <CardDescription>
                        Manage roles and permissions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full"
                        >
                            <div className="flex flex-col lg:flex-row">
                                <div className="flex flex-row items-end mb-6 md:mr-6">
                                    <FormField
                                        control={form.control}
                                        name="roleId"
                                        render={({ field }) => (
                                            <FormItem
                                                key="roleId"
                                                className="flex flex-col"
                                            >
                                                <FormLabel>Role</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-[200px] justify-between",
                                                                    !field.value &&
                                                                        "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? roles.find(
                                                                          (
                                                                              role
                                                                          ) =>
                                                                              role.value ===
                                                                              field.value
                                                                      )?.label
                                                                    : "Select role"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search role..." />
                                                            <CommandEmpty>
                                                                No role found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {roles.map(
                                                                    (role) => (
                                                                        <CommandItem
                                                                            value={
                                                                                role.label
                                                                            }
                                                                            key={
                                                                                role.value
                                                                            }
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    "roleId",
                                                                                    role.value
                                                                                );

                                                                                const existingPermissionSet =
                                                                                    permissionSets.find(
                                                                                        (
                                                                                            permissionSet
                                                                                        ) =>
                                                                                            permissionSet.roleId ===
                                                                                                role.value &&
                                                                                            permissionSet.branchId ===
                                                                                                form.getValues()
                                                                                                    .branchId
                                                                                    );

                                                                                form.setValue(
                                                                                    "permissions",
                                                                                    existingPermissionSet?.permissions
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    role.value ===
                                                                                        field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {
                                                                                role.label
                                                                            }
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addRoleModal.onOpen();
                                        }}
                                        className="mx-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-row items-end mr-6 md:mb-6 sm:mb-6 xs:mb-6">
                                    <FormField
                                        control={form.control}
                                        name="branchId"
                                        render={({ field }) => (
                                            <FormItem
                                                key="branchId"
                                                className="flex flex-col"
                                            >
                                                <FormLabel>Branch</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-[200px] justify-between",
                                                                    !field.value &&
                                                                        "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? roles.find(
                                                                          (
                                                                              role
                                                                          ) =>
                                                                              role.value ===
                                                                              field.value
                                                                      )?.label
                                                                    : "Select branch"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search branch..." />
                                                            <CommandEmpty>
                                                                No branch found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {branches.map(
                                                                    (
                                                                        branch
                                                                    ) => (
                                                                        <CommandItem
                                                                            value={
                                                                                branch.label
                                                                            }
                                                                            key={
                                                                                branch.value
                                                                            }
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    "branchId",
                                                                                    branch.value
                                                                                );

                                                                                const existingPermissionSet =
                                                                                    permissionSets.find(
                                                                                        (
                                                                                            permissionSet
                                                                                        ) =>
                                                                                            permissionSet.roleId ===
                                                                                                form.getValues()
                                                                                                    .roleId &&
                                                                                            permissionSet.branchId ===
                                                                                                branch.value
                                                                                    );

                                                                                form.setValue(
                                                                                    "permissions",
                                                                                    existingPermissionSet?.permissions
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    branch.value ===
                                                                                        field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {
                                                                                branch.label
                                                                            }
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addBranchModal.onOpen();
                                        }}
                                        className="mx-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="permissions"
                                    render={() => (
                                        <FormItem>
                                            {[
                                                "View Dashboard",
                                                "View Analytics",
                                                "Manage Roles",
                                                "Manage Users",
                                                "Manage Schedule",
                                            ].map((action) => (
                                                <FormField
                                                    key={snakeCase(action)}
                                                    control={form.control}
                                                    name="permissions"
                                                    render={({ field }) => (
                                                        <FormItem
                                                            key={snakeCase(
                                                                action
                                                            )}
                                                            className="flex items-end min-w-80 my-3"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    // id={
                                                                    //     snakeCase(
                                                                    //         action
                                                                    //     ) as any
                                                                    // }
                                                                    checked={field.value?.includes(
                                                                        snakeCase(
                                                                            action
                                                                        )
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        return checked
                                                                            ? field.onChange(
                                                                                  [
                                                                                      ...field.value,
                                                                                      snakeCase(
                                                                                          action
                                                                                      ),
                                                                                  ]
                                                                              )
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      (
                                                                                          value
                                                                                      ) =>
                                                                                          value !==
                                                                                          snakeCase(
                                                                                              action
                                                                                          )
                                                                                  )
                                                                              );
                                                                    }}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="ml-2">
                                                                {action}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    disabled={loading}
                                    type="submit"
                                >
                                    Save Changes
                                </Button>
                            </div>
                            <FormMessage />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default GlobalSettingsRolesPage;
