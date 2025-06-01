import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { type ButtonLink, type Status, type Stage, type User } from '@/types';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ContentCardProps {
  currentStepContent: {
    header: string;
    subheader?: string;
    content: string;
    buttonLinks: ButtonLink[];
  };
  user: User;
  stage: Stage;
  status: Status;
}

export default function ContentCard({ currentStepContent, user, stage, status }: ContentCardProps) {
  const [processing, setProcessing] = useState(false);
  const selfButtonRef = useRef<HTMLButtonElement>(null);
  const assistedButtonRef = useRef<HTMLButtonElement>(null);
  
  // Add state for alert dialog
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [currentButtonText, setCurrentButtonText] = useState('');
  const [currentPopupContent, setCurrentPopupContent] = useState('');

  const handleButtonClick = (user: User, buttonText: string, popup: string) => {
    // If popup content exists and is not "nothing", show the alert dialog
    if (popup && popup !== 'nothing') {
      setCurrentButtonText(buttonText);
      setCurrentPopupContent(popup);
      setAlertDialogOpen(true);
    } else {
      // Otherwise proceed directly with the action
      submitAction(buttonText);
    }
  };

  const submitAction = (buttonText: string) => {
    setProcessing(true);
    router.post(
      route('users.moveToNextStage', user.id),
      { button_text: buttonText },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      },
    );
  };

  return (
    <>
      <Card className="flex w-full flex-1 flex-col bg-[#c6c6c6] p-6 md:w-1/2 lg:h-auto lg:w-1/2 dark:bg-[#121212]">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold">{currentStepContent.header}</CardTitle>
          {currentStepContent.subheader && (
            <p className="mt-2 text-base font-medium text-gray-700 dark:text-gray-300">{currentStepContent.subheader}</p>
          )}
        </CardHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {currentStepContent.content.split('\n').map((paragraph: string, i: number) => (
              <p key={i} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="pt-4">
          {/* Render buttons based on buttonLinks from the stage */}
          {currentStepContent.buttonLinks && currentStepContent.buttonLinks.length > 0 ? (
            <>
              <div className="relative flex flex-wrap gap-2">
                {currentStepContent.buttonLinks.map((buttonLink, index) => (
                  <div className="relative" key={index}>
                    <Button
                      ref={index === 0 ? selfButtonRef : index === 1 ? assistedButtonRef : undefined}
                      className={`min-w-[120px] rounded-xl ${buttonLink.status === 'On Hold' || buttonLink.status === 'on hold' || buttonLink.status === 'done' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={buttonLink.status === 'On Hold' || buttonLink.status === 'on hold' || buttonLink.status === 'done' || processing}
                      onClick={() => handleButtonClick(user, buttonLink.text, buttonLink.popup)}
                    >
                      {processing ? (
                        <div className="flex items-center gap-2">
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        buttonLink.text
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Show status if available in the first button link */}
              {currentStepContent.buttonLinks.length > 0 && currentStepContent.buttonLinks[0].status && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      currentStepContent.buttonLinks[0].status === '0' || currentStepContent.buttonLinks[0].status === 'not requested'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : currentStepContent.buttonLinks[0].status === 'On Hold' || currentStepContent.buttonLinks[0].status === 'on hold'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          : currentStepContent.buttonLinks[0].status === 'done'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {currentStepContent.buttonLinks[0].status === '0' || currentStepContent.buttonLinks[0].status === 'not requested'
                      ? 'Not Requested'
                      : currentStepContent.buttonLinks[0].status === 'On Hold' || currentStepContent.buttonLinks[0].status === 'on hold'
                        ? 'On Hold'
                        : currentStepContent.buttonLinks[0].status === 'done'
                          ? 'Done'
                          : currentStepContent.buttonLinks[0].status}
                  </span>
                </div>
              )}
            </>
          ) : null}
        </div>
      </Card>

      {/* Alert Dialog for confirmation */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              {currentPopupContent}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => submitAction(currentButtonText)}
              disabled={processing}
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Continue'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}