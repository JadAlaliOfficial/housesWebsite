import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Stage } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface ShowStageProps {
  stage: Stage;
}

export default function StageShow({ stage }: ShowStageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stages', href: '/stages' },
    { title: stage.name, href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Stage: ${stage.name}`} />
      <div className="flex flex-1 flex-col gap-4 bg-[#E6E6E6] p-4 text-[#0a0a0a] dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
        {/* Card 1: Stage Title and Actions */}
        <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">{stage.name}</CardTitle>
              <CardDescription className="dark:text-gray-300">Stage Details</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.visit(route('stages.index'))}
                className="dark:border-[#3E3E3A] dark:text-[#E6E6E6]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.visit(route('stages.edit', stage.id))}
                className="dark:border-[#3E3E3A] dark:text-[#E6E6E6]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Card 2: Basic Information */}
        <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Detail label="Order" value={stage.order} />
            <Detail label="Name" value={stage.name} />
            <Detail label="Title" value={stage.title} />
            {stage.subtitle && <Detail label="Subtitle" value={stage.subtitle} />}
          </CardContent>
        </Card>

        {/* Card 3: Description */}
        {stage.description && (
          <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex-1 overflow-y-auto">
                <div
                  className="max-w-none text-welcome-foreground prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: stage.description }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card for Email Details */}
        {(stage.email_subject || stage.email_content) && (
          <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Email Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stage.email_subject && <Detail label="Email Subject" value={stage.email_subject} />}
              {stage.email_content && (
                <div>
                  <span className="font-medium dark:text-gray-300">Email Content:</span>
                  <div
                    className="mt-1 max-w-none text-welcome-foreground prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: stage.email_content }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Card 4: Button Linking */}
        {stage.button_linking?.length > 0 && (
          <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Button Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stage.button_linking.map((button, index) => (
                <div key={index} className=" rounded-md border p-4 dark:border-[#3E3E3A]">
                  <div className="mt-2">
                    <span className="text-lg font-bold dark:text-gray-300">Text:</span>
                    <div dangerouslySetInnerHTML={{ __html: button.text }} />
                  </div>
                  <div className="mt-4">
                    <span className="text-lg mb-2 font-bold dark:text-gray-300">Popup:</span>
                    <div dangerouslySetInnerHTML={{ __html: button.popup }} />
                  </div>
                  <div className="mt-2">
                    <span className="text-lg font-bold dark:text-gray-300">Status:</span>
                    <p className="ml-2 whitespace-pre-wrap dark:text-[#E6E6E6]">{button.status}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Card 5: Image */}
        {stage.image && (
          <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={`/storage/${stage.image}`}
                alt={stage.name || 'Stage Image'}
                className="w-full max-h-[400px] rounded-md border dark:border-[#3E3E3A] object-contain"
              />
            </CardContent>
          </Card>
        )}
        <footer className="mt-auto py-2 text-center text-xl text-gray-500 dark:text-gray-400 font-light font-alumni">
                MADE <span className='ml-2'>WITH</span> <span className='ml-2'>LOVE</span> <span className='ml-2'>BY</span> <span className='ml-2'>-R&D-</span> 
                </footer>
      </div>
    </AppLayout>
  );
}

// Reusable Detail row component
function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="font-medium dark:text-gray-300">{label}:</span>
      <span className="ml-2 dark:text-[#E6E6E6]">{value ?? 'N/A'}</span>
    </div>
  );
}
