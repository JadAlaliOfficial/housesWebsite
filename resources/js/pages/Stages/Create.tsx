import QuillEditor from '@/components/QuillEditor'; // Added QuillEditor import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useFieldArray, useForm as useHookForm } from 'react-hook-form';
import * as z from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stages', href: '/stages' },
    { title: 'Create', href: '/stages/create' },
];

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
];

const stageFormSchema = z.object({
    order: z.coerce.number().int().min(0, { message: 'Order must be a positive number or zero.' }),
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    email_subject: z.string().optional(), // Added email_subject
    email_content: z.string().optional(), // Added email_content
    button_linking: z
        .array(
            z.object({
                text: z.string().min(1, { message: 'Button text is required.' }),
                popup: z.union([z.string().max(500), z.literal('')]).optional(),
                status: z.union([z.string(), z.literal('')]).optional(),
            }),
        )
        .optional(),
    image: z.any().optional(),
});

type StageFormValues = z.infer<typeof stageFormSchema>;

export default function StageCreate() {
    const form = useHookForm<StageFormValues>({
        resolver: zodResolver(stageFormSchema),
        defaultValues: {
            order: 0,
            name: '',
            title: '',
            subtitle: '',
            description: '',
            email_subject: '', // Added email_subject
            email_content: '', // Added email_content
            button_linking: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'button_linking',
    });

    const onSubmit = (data: StageFormValues) => {
        const formData = new FormData();
        formData.append('order', data.order.toString());
        formData.append('name', data.name);
        formData.append('title', data.title);
        if (data.subtitle) formData.append('subtitle', data.subtitle);
        if (data.description) formData.append('description', data.description);
        if (data.email_subject) formData.append('email_subject', data.email_subject); // Added email_subject
        if (data.email_content) formData.append('email_content', data.email_content); // Added email_content

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

        const imageInput = document.getElementById('image') as HTMLInputElement;
        if (imageInput?.files?.[0]) {
            formData.append('image', imageInput.files[0]);
        }

        router.post(route('stages.store'), formData, { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Stage" />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#E6E6E6] p-4 text-[#0a0a0a] dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
                <Card className="bg-white border-[#3E3E3A] dark:bg-[#121212]">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Create New Stage</CardTitle>
                        <CardDescription className="dark:text-gray-300">Add a new stage to the house building process</CardDescription>
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
                                                <FormLabel>Order</FormLabel>
                                                <FormControl>
                                                    <Input className='border-[#3E3E3A]' type="number" placeholder="0" {...field} />
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
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input className='border-[#3E3E3A]' placeholder="Stage Name" {...field} />
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
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input className='border-[#3E3E3A]' placeholder="Stage Title" {...field} />
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
                                            <FormLabel>Subtitle (Optional)</FormLabel>
                                            <FormControl>
                                                <Input className='border-[#3E3E3A]' placeholder="Stage Subtitle" {...field} />
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
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <QuillEditor
                                                    name={field.name}
                                                    value={field.value || ''}
                                                    onChange={(content) => form.setValue('description', content)}
                                                    className="border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6] dark:placeholder:text-[#62605b]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            {/* Email Subject Field */}
                            <FormField
                                control={form.control}
                                name="email_subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Subject (Optional)</FormLabel>
                                        <FormControl>
                                            <Input className='border-[#3E3E3A]' placeholder="Enter email subject" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email Content Field */}
                            <FormField
                                control={form.control}
                                name="email_content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Content (Optional)</FormLabel>
                                        <FormControl>
                                            <QuillEditor
                                                name={field.name} // Added missing name prop
                                                value={field.value ?? ''}
                                                onChange={(value) => form.setValue('email_content', value)}
                                                className='border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6] dark:placeholder:text-[#62605b]'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                                <div className="flex flex-col space-y-4">
                                    <FormLabel>Buttons (Optional)</FormLabel>

                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 gap-4 rounded-md border p-4">
                                            <FormField
                                                control={form.control}
                                                name={`button_linking.${index}.text`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Button Text</FormLabel>
                                                        <FormControl>
                                                            <Input className='border-[#3E3E3A]' placeholder="Click Here" {...field} />
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
                                                        <FormLabel>Popup Content</FormLabel>
                                                        <FormControl>
                                                            <QuillEditor
                                                                name={field.name}
                                                                value={field.value || ''}
                                                                onChange={(content) => form.setValue(`button_linking.${index}.popup`, content)}
                                                                className="border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6] dark:placeholder:text-[#62605b]"
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
                                                        <FormLabel>Status</FormLabel>
                                                        <FormControl>
                                                            <>
                                                                <Input className='border-[#3E3E3A]' placeholder="null" list="status-suggestions" {...field} />
                                                                <datalist id="status-suggestions">
                                                                    <option value="on hold" />
                                                                </datalist>
                                                            </>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => remove(index)}
                                                className="w-1/4 justify-self-start "
                                            >
                                                Remove Button
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-[#3E3E3A] dark:text-[#E6E6E6] dark:hover:border-[#62605b] w-1/4 justify-self-start"
                                        onClick={() => append({ text: '', popup: '', status: '' })}
                                    >
                                        Add Button
                                    </Button>
                                </div>

                                <div>
                                    <FormLabel>Image (Optional)</FormLabel>
                                    <Input className='border-[#3E3E3A]' id="image" type="file" accept="image/*" />
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => router.visit(route('stages.index'))}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Stage</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <footer className="mt-auto py-2 text-center text-xl text-gray-500 dark:text-gray-400 font-light font-alumni">
                MADE <span className='ml-2'>WITH</span> <span className='ml-2'>LOVE</span> <span className='ml-2'>BY</span> <span className='ml-2'>-R&D-</span> 
                </footer>
            </div>
        </AppLayout>
    );
}
