import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import RichTextEditor from '@/components/rich-text-editor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useForm as useHookForm, useFieldArray } from 'react-hook-form';
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

export default function StageCreate() {
  const form = useHookForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: {
      order: 0,
      name: '',
      title: '',
      subtitle: '',
      description: '',
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
        <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
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
                          <Input type="number" placeholder="0" {...field} />
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
                          <Input placeholder="Stage Name" {...field} />
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
                        <Input placeholder="Stage Title" {...field} />
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
                        <Input placeholder="Stage Subtitle" {...field} />
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
                        <RichTextEditor
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Stage Description"
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Buttons (Optional)</FormLabel>

                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`button_linking.${index}.text`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Text</FormLabel>
                            <FormControl>
                              <Input placeholder="Click Here" {...field} />
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
                              <RichTextEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                                placeholder="Popup message (max 500 characters)"
                                height={200}
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
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select status</option>
                                {statusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" onClick={() => remove(index)} className="md:col-span-1">
                        Remove Button
                      </Button>
                    </div>
                  ))}

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => append({ text: '', popup: '', status: '' })}
                  >
                    Add Button
                  </Button>
                </div>

                <div>
                  <FormLabel>Image (Optional)</FormLabel>
                  <Input id="image" type="file" accept="image/*" />
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
      </div>
    </AppLayout>
  );
}