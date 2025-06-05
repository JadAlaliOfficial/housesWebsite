import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Stage } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Stages',
        href: '/stages',
    },
];

interface StagesIndexProps {
    stages: Stage[];
}

export default function StagesIndex({ stages }: StagesIndexProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

    // Handle delete stage
    const onDeleteConfirm = () => {
        if (selectedStage) {
            router.delete(route('stages.destroy', selectedStage.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    // Open delete dialog
    const handleDeleteClick = (stage: Stage) => {
        setSelectedStage(stage);
        setIsDeleteDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stages" />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#E6E6E6] p-4 text-[#0a0a0a] dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
                <Card className="bg-white dark:bg-[#121212] dark:border-[#3E3E3A]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle className="text-xl font-bold">Stages Management</CardTitle>
                            <CardDescription className="dark:text-gray-300">Manage all stages for the house building process</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="dark:border-[#3E3E3A] dark:text-[#E6E6E6] dark:hover:border-[#62605b]"
                                onClick={() => router.visit(route('stages.create'))}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Stage
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="dark:border-[#3E3E3A]">
                                    <TableHead className="dark:text-[#E6E6E6]">Order</TableHead>
                                    <TableHead className="dark:text-[#E6E6E6]">Name</TableHead>
                                    <TableHead className="dark:text-[#E6E6E6]">Title</TableHead>
                                    <TableHead className="dark:text-[#E6E6E6]">Created At</TableHead>
                                    <TableHead className="text-right dark:text-[#E6E6E6]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stages.map((stage) => (
                                    <TableRow key={stage.id} className="dark:border-[#3E3E3A]">
                                        <TableCell className="dark:text-[#E6E6E6]">{stage.order}</TableCell>
                                        <TableCell className="dark:text-[#E6E6E6]">{stage.name}</TableCell>
                                        <TableCell className="dark:text-[#E6E6E6]">{stage.title}</TableCell>
                                        <TableCell className="dark:text-[#E6E6E6]">{new Date(stage.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.visit(route('stages.show', stage.id))}
                                                className="mr-1 dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]"
                                                title="View Stage"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.visit(route('stages.edit', stage.id))}
                                                className="mr-1 dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]"
                                                title="Edit Stage"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteClick(stage)}
                                                className="dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]"
                                                title="Delete Stage"
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
                <footer className="mt-auto py-2 text-center text-xl text-gray-500 dark:text-gray-400 font-light font-alumni">
                MADE <span className='ml-2'>WITH</span> <span className='ml-2'>LOVE</span> <span className='ml-2'>BY</span> <span className='ml-2'>-R&D-</span> 
                </footer>
            </div>

            {/* Delete Stage Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] dark:border-[#3E3E3A] dark:bg-[#121212]">
                    <DialogHeader>
                        <DialogTitle>Delete Stage</DialogTitle>
                        <DialogDescription className="dark:text-gray-300">
                            Are you sure you want to delete this stage? This action cannot be undone.
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
        </AppLayout>
    );
}