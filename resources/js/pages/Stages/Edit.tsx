import QuillEditor from '@/components/QuillEditor'; // Added QuillEditor import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Stage } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {useState} from 'react';
import { Head, router } from '@inertiajs/react';
import { useFieldArray, useForm as useHookForm } from 'react-hook-form';
import * as z from 'zod';
import { Switch } from '@/components/ui/switch';

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
                replacing_text: z.boolean().optional(), // New field
            }),
        )
        .optional(),
    image: z.any().optional(),
});

type StageFormValues = z.infer<typeof stageFormSchema>;

export default function StageEdit({ stage }: EditStageProps) {
    const form = useHookForm<StageFormValues>({
        resolver: zodResolver(stageFormSchema),
        defaultValues: {
            order: stage.order,
            name: stage.name,
            title: stage.title,
            subtitle: stage.subtitle || '',
            description: stage.description || '',
            email_subject: stage.email_subject || '', // Added email_subject
            email_content: stage.email_content || '', // Added email_content
            button_linking: typeof stage.button_linking === 'string' 
        ? JSON.parse(stage.button_linking).map(btn => ({
            ...btn,
            replacing_text: btn.replacing_text ?? false // Handle existing data without this field
          }))
        : (stage.button_linking || []),
},
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'button_linking',
    });

    // Add this state to track if the image should be removed
    const [removeImage, setRemoveImage] = useState(false);
    // Add state to track the preview of the newly selected image
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const onSubmit = (data: StageFormValues) => {
        // Clean up description, email_content, and button_linking popups
        if (data.description === '<p><br></p>') {
            data.description = '';
        }

        if (data.email_content === '<p><br></p>') {
            data.email_content = '';
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('order', data.order.toString());
        formData.append('name', data.name);
        formData.append('title', data.title);

        formData.append('subtitle', data.subtitle ?? ''); // Always send subtitle, even if empty
        formData.append('description', data.description ?? '');
        formData.append('email_subject', data.email_subject ?? ''); // Added email_subject
        formData.append('email_content', data.email_content ?? ''); // Added email_content

       if (data.button_linking && data.button_linking.length > 0) {
        data.button_linking.forEach((button, index) => {
            formData.append(`button_linking[${index}][text]`, button.text);
            if (button.popup) {
                formData.append(`button_linking[${index}][popup]`, button.popup);
            }
            if (button.status) {
                formData.append(`button_linking[${index}][status]`, button.status);
            }
            // Add the new replacing_text field
            formData.append(`button_linking[${index}][replacing_text]`, (button.replacing_text || false).toString());
        });
    } else {
            // If button_linking is undefined or an empty array,
            // send '[]' to signal the backend to clear all buttons.
            formData.append('button_linking', '');
        }

        // Handle image upload/removal
        const imageInput = document.getElementById('image') as HTMLInputElement;
        if (removeImage) {
            formData.append('remove_image', 'true');
        } else if (imageInput?.files?.[0]) {
            formData.append('image', imageInput.files[0]);
        }

        router.post(route('stages.update', stage.id), formData, {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setRemoveImage(false); // Reset removeImage when a new file is selected
        }
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
                                                        className="border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
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
                                                        className="border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
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
                                                    className="border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
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
                                                    className="border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
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

                                <FormField
                                    control={form.control}
                                    name="email_content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Content (Optional)</FormLabel>
                                            <FormControl>
                                                <QuillEditor
                                                    name={field.name}
                                                    value={field.value ?? ''}
                                                    onChange={(value) => form.setValue('email_content', value)}
                                                    className='border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6] dark:placeholder:text-[#62605b]'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-col space-y-2">
                                    <FormLabel className="dark:text-[#E6E6E6]">Buttons (Optional)</FormLabel>

                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="grid grid-cols-1 gap-4 rounded-md border p-4"
                                        >
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
                                                                className="border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
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
                                                    <FormItem >
                                                        <FormLabel className="dark:text-[#E6E6E6]">Popup Content (Optional)</FormLabel>
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
                                            <FormField
            control={form.control}
            name={`button_linking.${index}.replacing_text`}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Replacing Text</FormLabel>
                        <div className="text-sm text-muted-foreground">
                            Enable this to replace the button text dynamically
                        </div>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
                                            <Button type="button" variant="destructive" onClick={() => remove(index)} className=" w-1/4 justify-self-start">
                                                Remove Button
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ text: '', popup: '', status: '', replacing_text: false })}
                                        className="border-[#3E3E3A] dark:text-[#E6E6E6] dark:hover:border-[#62605b] w-1/4 justify-self-start"
                                    >
                                        Add Button
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <FormLabel className="dark:text-[#E6E6E6]">Image (Optional)</FormLabel>
                                    <div className="flex flex-col gap-4">
                                        {(stage.image && !removeImage && !imagePreview) ? (
                                            <div className="mb-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="mb-2 text-sm dark:text-gray-300">Current Image:</p>
                                                </div>
                                                <img
                                                    src={`/storage/${stage.image}`}
                                                    alt={stage.name}
                                                    className="max-h-[200px] rounded-md border border-[#3E3E3A]"
                                                />
                                                <Button 
                                                    type="button" 
                                                    variant="destructive" 
                                                    onClick={() => setRemoveImage(true)}
                                                    className="h-8 mt-2 px-3 text-xs"
                                                >
                                                    Remove Image
                                                </Button>
                                            </div>
                                        ) : imagePreview ? (
                                            <div className="mb-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="mb-2 text-sm dark:text-gray-300">New Image Preview:</p>
                                                    <Button 
                                                        type="button" 
                                                        variant="destructive" 
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            const input = document.getElementById('image') as HTMLInputElement;
                                                            if (input) input.value = '';
                                                        }}
                                                        className="h-8 px-3 text-xs"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-[200px] rounded-md border border-[#3E3E3A]"
                                                />
                                            </div>
                                        ) : null}

                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            className="border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#E6E6E6]"
                                            onChange={handleImageChange}
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Supported formats: JPG, PNG, GIF. Max size: 2MB.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(route('stages.index'))}
                                        className="border-[#3E3E3A] dark:text-[#E6E6E6] dark:hover:border-[#62605b]"
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
                <footer className="mt-auto py-2 text-center text-lg text-gray-500 dark:text-gray-400 font-light font-roboto">
                MADE WITH ❤️ BY -R&D- 
                </footer>
            </div>
        </AppLayout>
    );
}