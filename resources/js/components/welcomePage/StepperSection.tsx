import { Box, Step, StepLabel, Stepper } from '@mui/material';

interface StepperSectionProps {
    activeStep: number;
    steps: { label: string }[];
}

export default function StepperSection({ activeStep, steps }: StepperSectionProps) {
    const isFinalStep = activeStep === steps.length - 1;
    
    return (
        <div className="sticky top-0 z-10 w-full max-w-[1200px] bg-welcome-background px-4 py-4 dark:bg-welcome-background">
            <Box sx={{ width: '100%' }}>
                <Stepper
                    activeStep={activeStep}
                    orientation="horizontal"
                    sx={{
                        '& .MuiStepConnector-root': {
                            top: 12,
                        },
                        '& .MuiStepConnector-line': {
                            borderColor: 'var(--color-welcome-foreground)',
                            opacity: 0.3,
                        },
                        '& .Mui-completed .MuiStepConnector-line': {
                            borderColor: 'var(--color-welcome-foreground)',
                            opacity: 1,
                        },
                        '& .MuiStepLabel-root': {
                            '& .MuiStepLabel-label': {
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--color-welcome-foreground)',
                                '@media (max-width: 1024px)': {
                                    display: 'none',
                                },
                            },
                            '&.Mui-completed .MuiStepLabel-label': {
                                color: 'var(--color-welcome-foreground) !important',
                            },
                            '&.Mui-active .MuiStepLabel-label': {
                                color: 'var(--color-welcome-foreground) !important',
                            },
                        },
                        // Dark mode styles
                        'html.dark &': {
                            '& .MuiStepConnector-line': {
                                borderColor: 'var(--color-welcome-foreground)',
                                opacity: 0.3,
                            },
                            '& .Mui-completed .MuiStepConnector-line': {
                                borderColor: 'var(--color-welcome-foreground)',
                                opacity: 1,
                            },
                            '& .MuiStepLabel-root': {
                                '& .MuiStepLabel-label': {
                                    color: 'var(--color-welcome-foreground)',
                                },
                                '&.Mui-completed .MuiStepLabel-label': {
                                    color: 'var(--color-welcome-foreground) !important',
                                },
                            },
                        },
                        backgroundColor: 'var(--color-welcome-background)',
                    }}
                >
                    {steps.map((stepItem, index) => (
                        <Step 
                            key={stepItem.label} 
                            completed={isFinalStep || index < activeStep}
                        >
                            <StepLabel>{stepItem.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </div>
    );
}