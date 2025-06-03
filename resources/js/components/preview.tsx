import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { motion } from 'framer-motion';

export default function WelcomePageMockup() {
  // Dummy stepper data
  const steps = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' }
  ];
  const activeStep = 1; // Currently on step 2 (0-indexed)
  
  // Dummy content data
  const currentStepContent = {
    header: 'Welcome to Our Service',
    subheader: 'Getting Started Guide',
    content: 'This is a dummy content section that would normally contain helpful information ',
    buttonLinks: [
      { text: 'Get Started', popup: 'nothing', status: '0' },
      { text: 'Learn More', popup: 'nothing', status: '0' }
    ]
  };

  return (
    <div className="h-1/2 w-full bg-background">
      {/* Header with logo and buttons */}
      <header className="mb-1 w-full max-w-[1200px] mx-auto">
        <nav className="flex w-full items-center justify-between p-1">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              Logo
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-1.5 text-sm leading-normal text-foreground opacity-50">
              <LogOut className="h-4 w-4" />
              Logout
            </div>
            
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-foreground opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>
          </div>
        </nav>
      </header>

      {/* Stepper */}
      <div className="sticky top-0 z-10 w-full max-w-[1200px] mx-auto bg-background px-4 py-2">
        <Box sx={{ width: '100%' }}>
          <Stepper
            activeStep={activeStep}
            orientation="horizontal"
            sx={{
              '& .MuiStepConnector-root': { top: 12 },
              '& .MuiStepConnector-line': { borderColor: 'transparent' },
              '& .MuiStepLabel-root': {
                '& .MuiStepLabel-label': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-foreground)',
                  '@media (max-width: 1024px)': { display: 'none' },
                },
                '&.Mui-completed .MuiStepLabel-label, &.Mui-active .MuiStepLabel-label': {
                  color: 'var(--color-foreground) !important',
                },
              },
              backgroundColor: 'var(--color-background)',
            }}
          >
            {steps.map((stepItem) => (
              <Step key={stepItem.label} completed={activeStep > steps.indexOf(stepItem)}>
                <StepLabel>{stepItem.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center p-1 md:flex-row md:items-stretch md:gap-6 md:p-2">
        {/* Image Card - replaced with colored box */}
        <Card className="h-64 w-full md:h-auto md:w-1/2 lg:w-1/2">
          <div className="flex h-full w-full items-center justify-center bg-blue-100">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-foreground">Image Placeholder</p>
            </motion.div>
          </div>
        </Card>

        {/* Content Card */}
        <Card className="mt-4 flex w-full flex-1 flex-col bg-background p-2 md:mt-0 md:w-1/2 lg:h-auto lg:w-1/2">
          <CardHeader className="p-0 pb-2">
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
              {currentStepContent.content.split('\n').map((paragraph, i) => (
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
                      <div className="inline-flex items-center justify-center rounded-xl bg-primary/50 text-secondary px-4 py-2 text-sm font-medium min-w-[120px] opacity-50">
                        {buttonLink.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status display */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Status:</span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Not Requested
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}