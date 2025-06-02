import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Stage } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import * as z from 'zod';

interface EditStageProps {
    stage: Stage;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Stages',
        href: '/stages',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

// Form schema for stage editing
const stageFormSchema = z.object({
    order: z.coerce.number().int().min(0, { message: 'Order must be a positive number or zero.' }),
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    button_linking: z.array(
        z.object({
            text: z.string().min(1, { message: 'Button text is required.' }),
            popup: z.union([z.string().max(500), z.literal('')]).optional(),
            status: z.union([z.string(), z.literal('')]).optional(),
        })
    ).optional(),
    image: z.any().optional(),
});

type StageFormValues = z.infer<typeof stageFormSchema>;

export default function StageEdit({ stage }: EditStageProps) {
    const [buttonCount, setButtonCount] = useState(stage.button_linking?.length || 0);
    
    // Create form
    const form = useHookForm<StageFormValues>({
        resolver: zodResolver(stageFormSchema),
        defaultValues: {
            order: stage.order,
            name: stage.name,
            title: stage.title,
            subtitle: stage.subtitle || '',
            description: stage.description || '',
            button_linking: stage.button_linking || [],
        },
    });

    // Handle form submission
    const onSubmit = (data: StageFormValues) => {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Laravel method spoofing for PUT requests
        formData.append('order', data.order.toString());
        formData.append('name', data.name);
        formData.append('title', data.title);
        
        if (data.subtitle) formData.append('subtitle', data.subtitle);
        if (data.description) formData.append('description', data.description);
        
        // Handle button linking
        if (data.button_linking && data.button_linking.length > 0) {
            data.button_linking.forEach((button, index) => {
                formData.append(`button_linking[${index}][text]`, button.text);
        
                if (button.popup) {
                    formData.append(`button_linking[${index}][popup]`, button.popup);
                }
        
                if (button.status) {
                    formData.append(`button_linking[${index}][status]`, button.status);
                }
            });
        }
        
        // Handle image upload
        const imageInput = document.getElementById('image') as HTMLInputElement;
        if (imageInput && imageInput.files && imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        router.post(route('stages.update', stage.id), formData, {
            forceFormData: true,
        });
    };

    // Add a new button field
    const addButtonField = () => {
        const currentButtons = form.getValues('button_linking') || [];
        form.setValue('button_linking', [...currentButtons, { text: '', popup: '', status: '' }]);
        setButtonCount(buttonCount + 1);
    };

    // Remove a button field
    const removeButtonField = (index: number) => {
        const currentButtons = form.getValues('button_linking') || [];
        form.setValue(
            'button_linking',
            currentButtons.filter((_, i) => i !== index)
        );
        setButtonCount(buttonCount - 1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Stage: ${stage.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#E6E6E6] p-4 text-[#0a0a0a] dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
                <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Edit Stage</CardTitle>
                        <CardDescription className="dark:text-gray-300">Update stage information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="dark:text-[#E6E6E6]">Order</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="dark:text-[#E6E6E6]">Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Stage Name"
                                                        {...field}
                                                        className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-[#E6E6E6]">Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Stage Title"
                                                    {...field}
                                                    className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subtitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-[#E6E6E6]">Subtitle (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Stage Subtitle"
                                                    {...field}
                                                    className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-[#E6E6E6]">Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Stage Description"
                                                    {...field}
                                                    className="min-h-[100px] dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Button Linking Fields */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="dark:text-[#E6E6E6]">Button Links (Optional)</FormLabel>
                                        {buttonCount < 2 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addButtonField}
                                                className="dark:border-[#3E3E3A] dark:text-[#E6E6E6] dark:hover:border-[#62605b]"
                                            >
                                                Add Button
                                            </Button>
                                        )}
                                    </div>

                                    {Array.from({ length: buttonCount }).map((_, index) => (
                                        <div key={index} className="space-y-4 rounded-md border p-4 dark:border-[#3E3E3A]">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium dark:text-[#E6E6E6]">Button {index + 1}</h4>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeButtonField(index)}
                                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Remove
                                                </Button>
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name={`button_linking.${index}.text`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="dark:text-[#E6E6E6]">Button Text</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Click Here"
                                                                {...field}
                                                                className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

<FormField
    control={form.control}
    name={`button_linking.${index}.popup`}
    render={({ field }) => (
        <FormItem>
            <FormLabel className="dark:text-[#E6E6E6]">Popup Content</FormLabel>
            <FormControl>
                <Textarea
                    placeholder="Popup message (max 500 characters)"
                    maxLength={500}
                    {...field}
                    className="min-h-[100px] dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>
<FormField
                                                control={form.control}
                                                name={`button_linking.${index}.status`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="dark:text-[#E6E6E6]">Button Status</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Click Here"
                                                                {...field}
                                                                className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <FormLabel className="dark:text-[#E6E6E6]">Image (Optional)</FormLabel>
                                    <div className="flex flex-col gap-4">
                                        {stage.image && (
                                            <div className="mb-2">
                                                <p className="mb-2 text-sm dark:text-gray-300">Current Image:</p>
                                                <img 
                                                    src={`/storage/${stage.image}`} 
                                                    alt={stage.name} 
                                                    className="max-h-[200px] rounded-md border dark:border-[#3E3E3A]" 
                                                />
                                            </div>
                                        )}
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            className="dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Supported formats: JPG, PNG, GIF. Max size: 2MB.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(route('stages.index'))}
                                        className="dark:border-[#3E3E3A] dark:text-[#E6E6E6] dark:hover:border-[#62605b]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="dark:bg-[#1a1a1a] dark:text-[#E6E6E6] dark:hover:bg-[#2a2a2a]">
                                        Update Stage
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}