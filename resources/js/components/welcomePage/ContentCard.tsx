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

  const handleButtonClick = (buttonText: string, popup: string | null | undefined | 0, buttonStatus: string | null | undefined | "0") => {
    // If button has no status or user already has status, submit directly
    if (buttonStatus === null || buttonStatus === undefined || buttonStatus === "0" || user.status !== null) {
      submitAction(buttonText);
      return;
    }
    
    // If button has status and user has no status, show popup if it exists
    if (popup !== null && popup !== undefined && popup !== "0") {
      setCurrentButtonText(buttonText);
      setCurrentPopupContent(popup);
      setAlertDialogOpen(true);
    } else {
      submitAction(buttonText);
    }
  };

  const submitAction = (buttonText: string) => {
    setProcessing(true);
    router.post(
      route('users.handleButtonClick', user.id),
      { button_text: buttonText },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      },
    );
  };

  // Buttons are disabled only if user has status or processing is true
  const allButtonsDisabled = user.status !== null || processing;

  return (
    <>
      <Card className="flex w-full flex-1 flex-col bg-welcome-background p-6 md:w-1/2 lg:h-auto lg:w-1/2">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold text-welcome-foreground">
            {currentStepContent.header}
          </CardTitle>
          {currentStepContent.subheader && (
            <p className="mt-2 text-base font-medium text-welcome-secondary">
              {currentStepContent.subheader}
            </p>
          )}
        </CardHeader>
        <div className="flex-1 overflow-y-auto">
          <div 
            className="max-w-none text-welcome-foreground prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: currentStepContent.content }}
          /> 
        </div>
        <div className="pt-4">
          {currentStepContent.buttonLinks?.length > 0 && (
            <>
              <div className="relative flex flex-wrap gap-2">
                {currentStepContent.buttonLinks.map((buttonLink, index) => {
                  // Determine button status text
                  const statusText = 
                    buttonLink.status === null || buttonLink.status === undefined || buttonLink.status === "0" ? 'Not Requested' : 
                    user.status === null ? 'Not Requested' : 
                    buttonLink.status;
                  
                  // Button is disabled only if allButtonsDisabled is true
                  const isDisabled = allButtonsDisabled;

                  return (
                    <div className="relative" key={index}>
                      <Button
                        ref={index === 0 ? selfButtonRef : index === 1 ? assistedButtonRef : undefined}
                        className={`min-w-[120px] rounded-xl bg-welcome-button text-welcome-button-text ${
                          isDisabled ? 
                          'cursor-not-allowed opacity-50' : 
                          'cursor-pointer hover:bg-welcome-button/90'
                        }`}
                        disabled={isDisabled}
                        onClick={() => handleButtonClick(
                          buttonLink.text, 
                          buttonLink.popup, 
                          buttonLink.status
                        )}
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
                  );
                })}
              </div>

              {/* Status display - shows status of first button */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-medium text-welcome-foreground">Status:</span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    currentStepContent.buttonLinks[0].status === null || 
                    currentStepContent.buttonLinks[0].status === undefined ||
                    currentStepContent.buttonLinks[0].status === "0" || 
                    user.status === null
                      ? 'bg-destructive/10 text-destructive'
                      : currentStepContent.buttonLinks[0].status === 'On Hold' || 
                        currentStepContent.buttonLinks[0].status === 'on hold'
                        ? 'bg-chart-1/10 text-chart-1'
                        : currentStepContent.buttonLinks[0].status === 'done'
                          ? 'bg-success/10 text-success'
                          : 'bg-primary/10 text-primary'
                  }`}
                >
                  {currentStepContent.buttonLinks[0].status === null || 
                   currentStepContent.buttonLinks[0].status === undefined ||
                   currentStepContent.buttonLinks[0].status === "0" || 
                   user.status === null
                    ? 'Not Requested'
                    : currentStepContent.buttonLinks[0].status === 'On Hold' || 
                      currentStepContent.buttonLinks[0].status === 'on hold'
                      ? 'On Hold'
                      : currentStepContent.buttonLinks[0].status === 'done'
                        ? 'Done'
                        : currentStepContent.buttonLinks[0].status}
                </span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Enhanced Alert Dialog for confirmation */}
      <AlertDialog  open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="bg-welcome-background text-welcome-foreground max-w-2xl max-h-3/4 overflow-auto p-8 rounded-2xl">
          <AlertDialogHeader className="bg-welcome-background mb-6">
            <AlertDialogTitle className="text-3xl font-bold text-welcome-foreground">
              {currentButtonText}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-lg leading-8 prose dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: currentPopupContent }} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="px-6 py-3 text-base rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => submitAction(currentButtonText)}
              disabled={processing}
              className="px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
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