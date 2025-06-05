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
import { ArrowRight, ArrowRightCircle, Edit, Link2, Link as LinkIcon, Plus, Trash, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import * as z from 'zod';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Stage {
    id: number;
    name: string;
    order: number;
}
interface DashboardProps {
    users: User[];
    stages: Stage[];
}

const userFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }).optional(),
    stage: z.coerce.number().min(0, { message: 'Stage is required.' }),
});

const getStageNameFromValue = (stageId: number | string, stages: Stage[]) => {
    const id = typeof stageId === 'string' ? parseFloat(stageId) : stageId;
    const stage = stages.find((s) => s.order === id);
    return stage ? `${stage.order}. ${stage.name}` : `Unknown Stage (${id})`;
};

// helper to read a cookie by name
function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default function Dashboard({ users, stages }: DashboardProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isMoveToStageDialogOpen, setIsMoveToStageDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // notification states for each button
    const [resetNotification, setResetNotification] = useState<{ message: string; isError?: boolean } | null>(null);
    const [regNotification, setRegNotification] = useState<{ message: string; isError?: boolean } | null>(null);

    const createForm = useHookForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: { name: '', email: '', password: '', stage: stages[0]?.order ?? 0 },
    });
    const editForm = useHookForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema.extend({ password: z.string().min(8).optional().or(z.literal('')) })),
        defaultValues: { name: '', email: '', password: '', stage: stages[0]?.order ?? 0 },
    });
    const moveToStageForm = useHookForm<{ stage: number }>({
        resolver: zodResolver(z.object({ stage: z.coerce.number().min(0) })),
        defaultValues: { stage: stages[0]?.order ?? 0 },
    });

    // Determine the order of the last stage
    const lastStageOrder = stages.length > 0 ? Math.max(...stages.map(s => s.order)) : 0;

    const onCreateSubmit = (data: z.infer<typeof userFormSchema>) =>
        router.post(route('users.store'), data, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    const onEditSubmit = (data: z.infer<typeof userFormSchema>) => {
        if (!selectedUser) return;
        router.put(route('users.update', selectedUser.id), data, {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
            },
        });
    };
    const onDeleteConfirm = () => {
        if (!selectedUser) return;
        router.delete(route('users.destroy', selectedUser.id), {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };
    const onMoveToStageSubmit = (data: { stage: number }) => {
        if (!selectedUser) return;
        router.post(route('users.moveToStage', selectedUser.id), data, {
            onSuccess: () => {
                setIsMoveToStageDialogOpen(false);
                moveToStageForm.reset();
            },
            preserveScroll: true,
        });
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        editForm.reset({
            name: user.name,
            email: user.email,
            password: '',
            stage: typeof user.stage === 'string' ? parseFloat(user.stage) : user.stage,
        });
        setIsEditDialogOpen(true);
    };
    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };
    const handleMoveToNextStage = (user: User) => router.post(route('users.moveToNextStage', user.id), {}, { preserveScroll: true });
    const handleMoveToStageClick = (user: User) => {
        setSelectedUser(user);
        moveToStageForm.reset({
            stage: typeof user.stage === 'string' ? parseFloat(user.stage) : user.stage,
        });
        setIsMoveToStageDialogOpen(true);
    };
    const renderStageSelectItems = () =>
        stages.map((stage) => (
            <SelectItem key={stage.id} value={stage.order.toString()}>
                {`${stage.order}. ${stage.name}`}
            </SelectItem>
        ));

    const makeTempLink = async (routeName: string, onNotify: React.Dispatch<React.SetStateAction<{ message: string; isError?: boolean } | null>>) => {
        try {
            const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
            const xsrfCookie = getCookie('XSRF-TOKEN');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };
            if (csrfMeta) headers['X-CSRF-TOKEN'] = csrfMeta;
            if (xsrfCookie) headers['X-XSRF-TOKEN'] = xsrfCookie;

            const res = await fetch(route(routeName), {
                method: 'POST',
                headers,
                body: JSON.stringify({}),
                credentials: 'same-origin',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`${res.status} ${res.statusText}\n\n${text}`);
            }
            const data = await res.json();
            const url = (data as any).url ?? (data as any).props?.url;
            if (!url) throw new Error('no `url` field in response');
            await navigator.clipboard.writeText(url);
            onNotify({ message: 'Link copied!', isError: false });
        } catch (err) {
            console.error(err);
            onNotify({ message: 'Failed to copy link.', isError: true });
        } finally {
            setTimeout(() => onNotify(null), 3000);
        }
    };

    const handleGenerateResetLink = () => makeTempLink('temporary.reset-link', setResetNotification);
    const handleGenerateRegisterLink = () => makeTempLink('temporary.register-link', setRegNotification);
    // ————————————————————————————————————————————————

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#E6E6E6] p-4 text-[#0a0a0a] dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
                <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212] pb-0">
                    <CardHeader className="flex justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Users Management</CardTitle>
                            <CardDescription className="dark:text-gray-300">Manage all users and their stages</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Add User */}
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Plus className="mr-2 h-4 w-4" /> Add User
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New User</DialogTitle>
                                    </DialogHeader>
                                    <Form {...createForm}>
                                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                                            <FormField
                                                name="name"
                                                control={createForm.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="email"
                                                control={createForm.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="password"
                                                control={createForm.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="stage"
                                                control={createForm.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stage</FormLabel>
                                                        <Select
                                                            onValueChange={(v) => field.onChange(parseFloat(v))}
                                                            defaultValue={field.value.toString()}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>{renderStageSelectItems()}</SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <DialogFooter>
                                                <Button type="submit">Save</Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>

                            {/* Temp Reset Link */}
                            <div className="flex flex-col items-start">
                                <Button variant="outline" size="sm" onClick={handleGenerateResetLink}>
                                    <Link2 className="mr-2 h-4 w-4" /> Temp Reset Link
                                </Button>
                                {resetNotification && (
                                    <span className={`mt-1 text-sm ${resetNotification.isError ? 'text-red-500' : 'text-green-500'}`}>
                                        {resetNotification.message}
                                    </span>
                                )}
                            </div>

                            {/* Temp Register Link */}
                            <div className="flex flex-col items-start">
                                <Button variant="outline" size="sm" onClick={handleGenerateRegisterLink}>
                                    <LinkIcon className="mr-2 h-4 w-4" /> Temp Register Link
                                </Button>
                                {regNotification && (
                                    <span className={`mt-1 text-sm ${regNotification.isError ? 'text-red-500' : 'text-green-500'}`}>
                                        {regNotification.message}
                                    </span>
                                )}
                            </div>

                            <Users className="text-muted-foreground h-6 w-6" />
                        </div>
                    </CardHeader>

                    <CardContent >
                        <Table >
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Stage</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                {users.map((user) => (
                                    <TableRow key={user.id} >
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{getStageNameFromValue(user.stage, stages)}</TableCell>
                                        <TableCell
                                            className={(() => {
                                                const userStageOrder = typeof user.stage === 'string' ? parseFloat(user.stage) : user.stage;
                                                let statusText: string = (user.status as string) ?? 'Not Requested';

                                                if (lastStageOrder > 0 && userStageOrder === lastStageOrder) {
                                                    statusText = 'done';
                                                }

                                                if (statusText === 'done') return 'text-green-600  font-medium';
                                                if (statusText === 'on hold') return 'text-yellow-500  font-medium';
                                                if (statusText === 'Not Requested' || statusText === 'not requested') return 'text-red-600  font-medium';
                                                return '';
                                            })()}
                                        >
                                            {(() => {
                                                const userStageOrder = typeof user.stage === 'string' ? parseFloat(user.stage) : user.stage;
                                                let statusText: string = (user.status as string) ?? 'Not Requested';

                                                if (lastStageOrder > 0 && userStageOrder === lastStageOrder) {
                                                    statusText = 'done';
                                                }
                                                // Normalize display for 'not requested' to 'Not Requested'
                                                return statusText === 'not requested' ? 'Not Requested' : statusText;
                                            })()}
                                        </TableCell>
                                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="space-x-1 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleMoveToNextStage(user)}>
                                                <ArrowRightCircle />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleMoveToStageClick(user)}>
                                                <ArrowRight />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                                                <Edit />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(user)}>
                                                <Trash />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    
                </Card>
                <footer className="mt-auto py-2 text-center text-xl text-gray-500 dark:text-gray-400 font-light font-alumni">
                MADE <span className='ml-2'>WITH</span> <span className='ml-2'>LOVE</span> <span className='ml-2'>BY</span> <span className='ml-2'>-R&D-</span> 
                </footer>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <FormField
                                name="name"
                                control={editForm.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={editForm.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={editForm.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Leave blank to keep current" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="stage"
                                control={editForm.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stage</FormLabel>
                                        <Select onValueChange={(v) => field.onChange(parseFloat(v))} defaultValue={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>{renderStageSelectItems()}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>Are you sure? This action is irreversible.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move User to Stage</DialogTitle>
                    </DialogHeader>
                    <Form {...moveToStageForm}>
                        <form onSubmit={moveToStageForm.handleSubmit(onMoveToStageSubmit)} className="space-y-4">
                            <FormField
                                name="stage"
                                control={moveToStageForm.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stage</FormLabel>
                                        <Select onValueChange={(v) => field.onChange(parseFloat(v))} defaultValue={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>{renderStageSelectItems()}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Move</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
