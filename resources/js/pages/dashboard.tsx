import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { ArrowRight, ArrowRightCircle, Edit, Plus, Trash, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import * as z from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Helper function to get stage name from stage value
const getStageNameFromValue = (stageValue: number | string): string => {
    // Ensure we're working with a number
    const numericValue = typeof stageValue === 'string' ? parseFloat(stageValue) : stageValue;

    // Convert to string with fixed precision to handle floating point comparison issues
    const stageValueStr = numericValue.toFixed(1);

    const stageMap: Record<string, string> = {
        '0.0': 'Admin',
        '1.0': 'Meet Builder & Design Home',
        '2.0': 'Plumbing Company',
        '2.5': 'Plumbing - Awaiting Approval',
        '3.0': 'Light Fixture Company',
        '3.5': 'Light Fixture - Awaiting Approval',
        '4.0': 'Countertop Company',
        '4.5': 'Countertop - Awaiting Approval',
        '5.0': 'Cabinet Company',
        '5.5': 'Cabinet - Awaiting Approval',
        '6.0': 'Flooring & Tile',
        '6.5': 'Flooring & Tile - Awaiting Approval',
        '7.0': 'Key Handed',
    };

    return stageMap[stageValueStr] || `Unknown Stage (${numericValue})`;
};

interface DashboardProps {
    users: User[];
}

// Form schema for user creation and editing
const userFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }).optional(),
    stage: z.coerce.number().min(0, { message: 'Stage must be a positive number or zero.' }),
});

export default function Dashboard({ users }: DashboardProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isMoveToStageDialogOpen, setIsMoveToStageDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Create user form
    const createForm = useHookForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            stage: 1.0, // Updated to explicitly use decimal
        },
    });

    // Edit user form
    const editForm = useHookForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(
            userFormSchema.extend({
                password: z.string().min(8, { message: 'Password must be at least 8 characters.' }).optional().or(z.literal('')),
            }),
        ),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            stage: 1.0, // Updated to explicitly use decimal
        },
    });

    // Handle create user
    const onCreateSubmit = (data: z.infer<typeof userFormSchema>) => {
        router.post(route('users.store'), data, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    // Handle edit user
    const onEditSubmit = (data: z.infer<typeof userFormSchema>) => {
        if (selectedUser) {
            router.put(route('users.update', selectedUser.id), data, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    editForm.reset();
                },
            });
        }
    };

    // Handle delete user
    const onDeleteConfirm = () => {
        if (selectedUser) {
            router.delete(route('users.destroy', selectedUser.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    // Open edit dialog and populate form
    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        // Ensure stage is properly converted to a number
        const stageValue = typeof user.stage === 'string' ? parseFloat(user.stage) : user.stage;

        editForm.reset({
            name: user.name,
            email: user.email,
            password: '',
            stage: stageValue,
        });
        setIsEditDialogOpen(true);
    };

    // Open delete dialog
    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    // Add a new form for moving to a specific stage
    const moveToStageForm = useHookForm<{ stage: number }>({
        resolver: zodResolver(
            z.object({
                stage: z.coerce.number().min(0, { message: 'Stage must be a positive number or zero.' }),
            }),
        ),
        defaultValues: {
            stage: 1.0,
        },
    });

    // Handle move to next stage
    const handleMoveToNextStage = (user: User) => {
        router.post(
            route('users.moveToNextStage', user.id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    // Handle move to specific stage
    const onMoveToStageSubmit = (data: { stage: number }) => {
        if (selectedUser) {
            router.post(route('users.moveToStage', selectedUser.id), data, {
                onSuccess: () => {
                    setIsMoveToStageDialogOpen(false);
                    moveToStageForm.reset();
                },
                preserveScroll: true,
            });
        }
    };

    // Open move to stage dialog
    const handleMoveToStageClick = (user: User) => {
        setSelectedUser(user);
        // Set current stage as default
        const stageValue = typeof user.stage === 'string' ? parseFloat(user.stage) : user.stage;
        moveToStageForm.reset({
            stage: stageValue,
        });
        setIsMoveToStageDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#E6E6E6] p-4 text-[#0a0a0a] dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
                <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle className="text-xl font-bold">Users Management</CardTitle>
                            <CardDescription className="dark:text-gray-300">Manage all users and their stages</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="dark:border-[#3E3E3A] dark:text-[#E6E6E6] dark:hover:border-[#62605b]"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add User
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] dark:border-[#3E3E3A] dark:bg-[#121212]">
                                    <DialogHeader>
                                        <DialogTitle>Create New User</DialogTitle>
                                        <DialogDescription className="dark:text-gray-300">
                                            Add a new user to the system. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...createForm}>
                                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                                            <FormField
                                                control={createForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="dark:text-[#E6E6E6]">Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="John Doe"
                                                                {...field}
                                                                className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={createForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="dark:text-[#E6E6E6]">Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="john@example.com"
                                                                {...field}
                                                                className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={createForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="dark:text-[#E6E6E6]">Password</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="********"
                                                                {...field}
                                                                className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={createForm.control}
                                                name="stage"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="dark:text-[#E6E6E6]">Stage</FormLabel>
                                                        <Select
                                                            onValueChange={(value) => field.onChange(parseFloat(value))}
                                                            defaultValue={field.value.toString()}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]">
                                                                    <SelectValue placeholder="Select a stage" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]">
                                                                <SelectItem value="0">Admin </SelectItem>
                                                                <SelectItem value="1">Meet Builder & Design Home </SelectItem>
                                                                <SelectItem value="2">Plumbing Company </SelectItem>
                                                                <SelectItem value="2.5">Plumbing - Awaiting Approval </SelectItem>
                                                                <SelectItem value="3">Light Fixture Company </SelectItem>
                                                                <SelectItem value="3.5">Light Fixture - Awaiting Approval </SelectItem>
                                                                <SelectItem value="4">Countertop Company </SelectItem>
                                                                <SelectItem value="4.5">Countertop - Awaiting Approval </SelectItem>
                                                                <SelectItem value="5">Cabinet Company</SelectItem>
                                                                <SelectItem value="5.5">Cabinet - Awaiting Approval </SelectItem>
                                                                <SelectItem value="6">Flooring & Tile</SelectItem>
                                                                <SelectItem value="6.5">Flooring & Tile - Awaiting Approval</SelectItem>
                                                                <SelectItem value="7">Key Handed </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <DialogFooter>
                                                <Button type="submit" className="dark:bg-[#1a1a1a] dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]">
                                                    Save User
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                            <Users className="text-muted-foreground h-6 w-6" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="dark:border-[#3E3E3A]">
                                    <TableHead className="dark:text-[#E6E6E6]">ID</TableHead>
                                    <TableHead className="dark:text-[#E6E6E6]">Name</TableHead>
                                    <TableHead className="dark:text-[#E6E6E6]">Email</TableHead>
                                    <TableHead className="dark:text-[#E6E6E6]">Stage</TableHead>
                                    <TableHead className="dark:text-[#E6E6E6]">Created At</TableHead>
                                    <TableHead className="text-right dark:text-[#E6E6E6]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="dark:border-[#3E3E3A]">
                                        <TableCell className="dark:text-[#E6E6E6]">{user.id}</TableCell>
                                        <TableCell className="dark:text-[#E6E6E6]">{user.name}</TableCell>
                                        <TableCell className="dark:text-[#E6E6E6]">{user.email}</TableCell>
                                        <TableCell className="dark:text-[#E6E6E6]">{getStageNameFromValue(user.stage)}</TableCell>
                                        <TableCell className="dark:text-[#E6E6E6]">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleMoveToNextStage(user)}
                                                className="mr-1 dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]"
                                                title="Move to Next Stage"
                                            >
                                                <ArrowRightCircle className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleMoveToStageClick(user)}
                                                className="mr-1 dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]"
                                                title="Move to Specific Stage"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditClick(user)}
                                                className="mr-1 dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]"
                                                title="Edit User"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteClick(user)}
                                                className="dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]"
                                                title="Delete User"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px] dark:border-[#3E3E3A] dark:bg-[#121212]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription className="dark:text-gray-300">
                            Update user information. Leave password blank to keep current password.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#E6E6E6]">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                {...field}
                                                className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#E6E6E6]">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                {...field}
                                                className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#E6E6E6]">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Leave blank to keep current password"
                                                {...field}
                                                className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#E6E6E6]">Stage</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(parseFloat(value))} defaultValue={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]">
                                                    <SelectValue placeholder="Select a stage" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]">
                                                <SelectItem value="0">Admin</SelectItem>
                                                <SelectItem value="1">Meet Builder & Design Home</SelectItem>
                                                <SelectItem value="2">Plumbing Company</SelectItem>
                                                <SelectItem value="2.5">Plumbing - Awaiting Approval</SelectItem>
                                                <SelectItem value="3">Light Fixture Company</SelectItem>
                                                <SelectItem value="3.5">Light Fixture - Awaiting Approval</SelectItem>
                                                <SelectItem value="4">Countertop Company</SelectItem>
                                                <SelectItem value="4.5">Countertop - Awaiting Approval</SelectItem>
                                                <SelectItem value="5">Cabinet Company</SelectItem>
                                                <SelectItem value="5.5">Cabinet - Awaiting Approval</SelectItem>
                                                <SelectItem value="6">Flooring & Tile</SelectItem>
                                                <SelectItem value="6.5">Flooring & Tile - Awaiting Approval</SelectItem>
                                                <SelectItem value="7">Key Handed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" className="dark:bg-[#1a1a1a] dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] dark:border-[#3E3E3A] dark:bg-[#121212]">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription className="dark:text-gray-300">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="dark:border-[#3E3E3A] dark:text-[#E6E6E6]">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={onDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Move to Stage Dialog */}
            <Dialog open={isMoveToStageDialogOpen} onOpenChange={setIsMoveToStageDialogOpen}>
                <DialogContent className="sm:max-w-[425px] dark:border-[#3E3E3A] dark:bg-[#121212]">
                    <DialogHeader>
                        <DialogTitle>Move to Stage</DialogTitle>
                        <DialogDescription className="dark:text-gray-300">Select a stage to move the user to.</DialogDescription>
                    </DialogHeader>
                    <Form {...moveToStageForm}>
                        <form onSubmit={moveToStageForm.handleSubmit(onMoveToStageSubmit)} className="space-y-4">
                            <FormField
                                control={moveToStageForm.control}
                                name="stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#E6E6E6]">Stage</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(parseFloat(value))} defaultValue={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]">
                                                    <SelectValue placeholder="Select a stage" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]">
                                                <SelectItem value="0">Admin</SelectItem>
                                                <SelectItem value="1">Meet Builder & Design Home</SelectItem>
                                                <SelectItem value="2">Plumbing Company</SelectItem>
                                                <SelectItem value="2.5">Plumbing - Awaiting Approval</SelectItem>
                                                <SelectItem value="3">Light Fixture Company</SelectItem>
                                                <SelectItem value="3.5">Light Fixture - Awaiting Approval</SelectItem>
                                                <SelectItem value="4">Countertop Company</SelectItem>
                                                <SelectItem value="4.5">Countertop - Awaiting Approval</SelectItem>
                                                <SelectItem value="5">Cabinet Company</SelectItem>
                                                <SelectItem value="5.5">Cabinet - Awaiting Approval</SelectItem>
                                                <SelectItem value="6">Flooring & Tile</SelectItem>
                                                <SelectItem value="6.5">Flooring & Tile - Awaiting Approval</SelectItem>
                                                <SelectItem value="7">Key Handed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" className="dark:bg-[#1a1a1a] dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]">
                                    Move
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
