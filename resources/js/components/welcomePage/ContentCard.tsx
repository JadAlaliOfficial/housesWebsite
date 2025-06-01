import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { type ButtonLink, type Status, type Stage, type User } from '@/types';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';

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
  const [showSelfTooltip, setShowSelfTooltip] = useState(false);
  const [showAssistedTooltip, setShowAssistedTooltip] = useState(false);
  const [showSelfMobileInfo, setShowSelfMobileInfo] = useState(false);
  const [showAssistedMobileInfo, setShowAssistedMobileInfo] = useState(false);
  const selfButtonRef = useRef<HTMLButtonElement>(null);
  const assistedButtonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = (user: User, buttonText: string) => {
    setProcessing(true);
    router.post(
      route('users.moveToNextStage', user.id),
      { button_text: buttonText }, // Send the button text to the backend
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      },
    );
  };

  // Add function to toggle mobile info
  const toggleMobileInfo = (infoType: 'self' | 'assisted') => {
    if (infoType === 'self') {
      setShowSelfMobileInfo(!showSelfMobileInfo);
      setShowAssistedMobileInfo(false); // Close the other info if open
    } else {
      setShowAssistedMobileInfo(!showAssistedMobileInfo);
      setShowSelfMobileInfo(false); // Close the other info if open
    }
  };

  return (
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
                    onClick={() => handleButtonClick(user, buttonLink.text)}
                    onMouseEnter={() => index === 0 ? setShowSelfTooltip(true) : setShowAssistedTooltip(true)}
                    onMouseLeave={() => index === 0 ? setShowSelfTooltip(false) : setShowAssistedTooltip(false)}
                  >
                    {processing ? 'Processing...' : buttonLink.text}
                  </Button>
                  {/* Info button for mobile */}
                  <button
                    className="absolute  top-1/2 right-[-30px] flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-gray-200 text-gray-700 md:hidden dark:bg-gray-700 dark:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMobileInfo(index === 0 ? 'self' : 'assisted');
                    }}
                    aria-label="More information"
                  >
                    <span className="text-xs font-bold">i</span>
                  </button>
                  {/* Desktop tooltip */}
                  {(index === 0 ? showSelfTooltip : showAssistedTooltip) && (
                    <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-64 rounded-md bg-white p-3 text-sm shadow-lg md:block dark:bg-gray-800">
                      <div className="mb-1 font-semibold">{buttonLink.text}</div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {buttonLink.popup && buttonLink.popup !== 'nothing' 
                          ? buttonLink.popup 
                          : 'No additional information available.'}
                      </p>
                      <div className="absolute -bottom-2 left-5 h-3 w-3 rotate-45 bg-white dark:bg-gray-800"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile information panels - combined into one panel */}
            {(showSelfMobileInfo || showAssistedMobileInfo) && (
              <div className="mt-4 rounded-md bg-white p-3 text-sm shadow-md md:hidden dark:bg-gray-800">
                {currentStepContent.buttonLinks.map((buttonLink, index) => (
                  <div key={index} className={index !== 0 ? "mt-3 border-t border-gray-200 pt-3 dark:border-gray-700" : "mb-3 border-b border-gray-200 pb-3 dark:border-gray-700"}>
                    <div className="mb-1 font-semibold">{buttonLink.text}</div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {buttonLink.popup && buttonLink.popup !== 'nothing' 
                        ? buttonLink.popup 
                        : 'No additional information available.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
  );
}