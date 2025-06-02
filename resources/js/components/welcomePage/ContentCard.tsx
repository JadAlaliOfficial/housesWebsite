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

  const handleButtonClick = (buttonText: string, popup: string) => {
    if (popup && popup !== 'nothing') {
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
      <Card className="flex w-full flex-1 flex-col bg-background p-6 md:w-1/2 lg:h-auto lg:w-1/2">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            {currentStepContent.header}
          </CardTitle>
          {currentStepContent.subheader && (
            <p className="mt-2 text-base font-medium text-foreground/80">
              {currentStepContent.subheader}
            </p>
          )}
        </CardHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-none [&>p]:text-foreground">
            {currentStepContent.content.split('\n').map((paragraph: string, i: number) => (
              <p key={i} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="pt-4">
          {currentStepContent.buttonLinks?.length > 0 && (
            <>
              <div className="relative flex flex-wrap gap-2">
                {currentStepContent.buttonLinks.map((buttonLink, index) => (
                  <div className="relative" key={index}>
                    <Button
                      ref={index === 0 ? selfButtonRef : index === 1 ? assistedButtonRef : undefined}
                      className={`min-w-[120px] rounded-xl bg-primary text-secondary ${
                        buttonLink.status === 'On Hold' || 
                        buttonLink.status === 'on hold' || 
                        buttonLink.status === 'done' ? 
                        'cursor-not-allowed opacity-50' : 
                        'cursor-pointer hover:bg-primary/90'
                      }`}
                      disabled={
                        buttonLink.status === 'On Hold' || 
                        buttonLink.status === 'on hold' || 
                        buttonLink.status === 'done' || 
                        processing
                      }
                      onClick={() => handleButtonClick(buttonLink.text, buttonLink.popup)}
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

              {currentStepContent.buttonLinks[0].status && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Status:</span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      currentStepContent.buttonLinks[0].status === '0' || 
                      currentStepContent.buttonLinks[0].status === 'not requested'
                        ? 'bg-destructive/10 text-destructive'
                        : currentStepContent.buttonLinks[0].status === 'On Hold' || 
                          currentStepContent.buttonLinks[0].status === 'on hold'
                          ? 'bg-warning/10 text-warning'
                          : currentStepContent.buttonLinks[0].status === 'done'
                            ? 'bg-success/10 text-success'
                            : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {currentStepContent.buttonLinks[0].status === '0' || 
                     currentStepContent.buttonLinks[0].status === 'not requested'
                      ? 'Not Requested'
                      : currentStepContent.buttonLinks[0].status === 'On Hold' || 
                        currentStepContent.buttonLinks[0].status === 'on hold'
                        ? 'On Hold'
                        : currentStepContent.buttonLinks[0].status === 'done'
                          ? 'Done'
                          : currentStepContent.buttonLinks[0].status}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {currentButtonText}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-secondary">
              {currentPopupContent}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => submitAction(currentButtonText)}
              disabled={processing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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