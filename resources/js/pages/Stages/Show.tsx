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

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Basic Info */}
                <section>
                  <h3 className="text-lg font-semibold dark:text-[#E6E6E6]">Basic Information</h3>
                  <div className="mt-2 space-y-2">
                    <Detail label="Order" value={stage.order} />
                    <Detail label="Name" value={stage.name} />
                    <Detail label="Title" value={stage.title} />
                    {stage.subtitle && <Detail label="Subtitle" value={stage.subtitle} />}
                  </div>
                </section>

                {/* Description */}
                {stage.description && (
                  <section>
                    <h3 className="text-lg font-semibold dark:text-[#E6E6E6]">Description</h3>
                    <p className="mt-2 whitespace-pre-wrap dark:text-[#E6E6E6]">{stage.description}</p>
                  </section>
                )}

                {/* Button Linking */}
                {stage.button_linking?.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold dark:text-[#E6E6E6]">Button Links</h3>
                    <div className="mt-2 space-y-4">
                      {stage.button_linking.map((button, index) => (
                        <div key={index} className="rounded-md border p-4 dark:border-[#3E3E3A]">
                          <Detail label="Text" value={button.text} />
                          <div className="mt-2">
                            <span className="font-medium dark:text-gray-300">Popup:</span>
                            <p className="ml-2 whitespace-pre-wrap dark:text-[#E6E6E6]">{button.popup}</p>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium dark:text-gray-300">Status:</span>
                            <p className="ml-2 whitespace-pre-wrap dark:text-[#E6E6E6]">{button.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* RIGHT COLUMN */}
              {stage.image && (
                <div>
                  <h3 className="text-lg font-semibold dark:text-[#E6E6E6]">Image</h3>
                  <div className="mt-2">
                    <img
                      src={`/storage/${stage.image}`}
                      alt={stage.name || 'Stage Image'}
                      className="w-full max-h-[400px] rounded-md border dark:border-[#3E3E3A] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
