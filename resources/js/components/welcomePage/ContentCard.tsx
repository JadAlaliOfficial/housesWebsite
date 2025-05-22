import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { type StepContent, type StepKey, type Status } from '@/types';
import { type User } from '@/types';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface ContentCardProps {
  currentStepContent: StepContent;
  user: User;
  step: StepKey;
  status: Status;
}

export default function ContentCard({ currentStepContent, user, step, status }: ContentCardProps) {
  const [processing, setProcessing] = useState(false);
  const [showSelfTooltip, setShowSelfTooltip] = useState(false);
  const [showAssistedTooltip, setShowAssistedTooltip] = useState(false);
  const [showSelfMobileInfo, setShowSelfMobileInfo] = useState(false);
  const [showAssistedMobileInfo, setShowAssistedMobileInfo] = useState(false);
  const selfButtonRef = useRef<HTMLButtonElement>(null);
  const assistedButtonRef = useRef<HTMLButtonElement>(null);

  const handleMoveToNextStage = (user: User, action: 'self' | 'assisted') => {
    setProcessing(true);
    router.post(
      route('users.moveToNextStage', user.id),
      { action }, // Send the action to the backend
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
        {/* Special case for first step */}
        {user.stage === 1 ? (
          <Button className="min-w-[120px] cursor-pointer" onClick={() => handleMoveToNextStage(user, 'self')}>
            Let's go
          </Button>
        ) : /* Special case for final step - no buttons */
        user.stage === 7 ? null : (
          /* Normal case for other steps */
          <>
            <div className="relative flex flex-wrap gap-2">
              <div className="relative">
                <Button
                  ref={selfButtonRef}
                  className={`min-w-[120px] ${status === 'on hold' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={status === 'on hold' || processing}
                  onClick={() => handleMoveToNextStage(user, 'self')}
                  onMouseEnter={() => setShowSelfTooltip(true)}
                  onMouseLeave={() => setShowSelfTooltip(false)}
                >
                  {processing ? 'Processing...' : 'Do it yourself'}
                </Button>
                {/* Desktop tooltip */}
                {showSelfTooltip && (
                  <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-64 rounded-md bg-white p-3 text-sm shadow-lg md:block dark:bg-gray-800">
                    <div className="mb-1 font-semibold">Visit Our Trusted Partner</div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Schedule a visit to explore products in person and receive personalized, expert guidance
                      tailored to your needs.
                    </p>
                    <div className="absolute -bottom-2 left-5 h-3 w-3 rotate-45 bg-white dark:bg-gray-800"></div>
                  </div>
                )}
              </div>

              {/* Only show "Let us handle it" button for steps 2 and 3 */}
              {(user.stage === 2 || user.stage === 2.5 || user.stage === 3 || user.stage === 3.5) && (
                <div className="relative">
                  <Button
                    ref={assistedButtonRef}
                    className={`min-w-[120px] ${status === 'on hold' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={status === 'on hold' || processing}
                    onClick={() => handleMoveToNextStage(user, 'assisted')}
                    onMouseEnter={() => setShowAssistedTooltip(true)}
                    onMouseLeave={() => setShowAssistedTooltip(false)}
                  >
                    {processing ? 'Processing...' : 'Let us handle it'}
                  </Button>
                  {/* Info button for mobile */}
                  <button
                    className="absolute top-1/2 right-[-30px] flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-gray-200 text-gray-700 md:hidden dark:bg-gray-700 dark:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMobileInfo('assisted');
                    }}
                    aria-label="More information"
                  >
                    <span className="text-xs font-bold">i</span>
                  </button>
                  {/* Desktop tooltip */}
                  {showAssistedTooltip && (
                    <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-64 rounded-md bg-white p-3 text-sm shadow-lg md:block dark:bg-gray-800">
                      <div className="mb-1 font-semibold">Select from Curated Options Online</div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Access a collection of thoughtfully selected packages directly through your
                        account—convenient, efficient, and tailored to your style.
                      </p>
                      <div className="absolute -bottom-2 left-5 h-3 w-3 rotate-45 bg-white dark:bg-gray-800"></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile information panels - combined into one panel */}
            {(showSelfMobileInfo || showAssistedMobileInfo) && (
              <div className="mt-4 rounded-md bg-white p-3 text-sm shadow-md md:hidden dark:bg-gray-800">
                <div className="mb-3 border-b border-gray-200 pb-3 dark:border-gray-700">
                  <div className="mb-1 font-semibold">Visit Our Trusted Partner ( Do it yourself )</div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Schedule a visit to explore products in person and receive personalized, expert guidance
                    tailored to your needs.
                  </p>
                </div>

                {(user.stage === 2 || user.stage === 2.5 || user.stage === 3 || user.stage === 3.5) && (
                  <div>
                    <div className="mb-1 font-semibold">
                      Select from Curated Options Online ( Let's handle it )
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Access a collection of thoughtfully selected packages directly through your
                      account—convenient, efficient, and tailored to your style.
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  status === 'not requested'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : status === 'on hold'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}