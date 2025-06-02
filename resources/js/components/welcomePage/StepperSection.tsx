import { Box, Step, StepLabel, Stepper } from '@mui/material';

interface StepperSectionProps {
    activeStep: number;
    steps: { label: string }[];
}

export default function StepperSection({ activeStep, steps }: StepperSectionProps) {
    const isFinalStep = activeStep === steps.length - 1;
    
    return (
        <div className="sticky top-0 z-10 w-full max-w-[1200px] bg-background px-4 py-4 dark:bg-background">
            <Box sx={{ width: '100%' }}>
            <Stepper
    activeStep={activeStep}
    orientation="horizontal"
    sx={{
        '& .MuiStepConnector-root': {
            top: 12,
        },
        '& .MuiStepConnector-line': {
            borderColor: 'transparent', // Removed border
        },
        'html.dark & .MuiStepConnector-line': {
            borderColor: 'transparent', // Removed border
        },
        '& .Mui-completed .MuiStepConnector-line': {
            borderColor: 'transparent', // Removed border
        },
        '& .MuiStepLabel-root': {
            '& .MuiStepLabel-label': {
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-foreground)',
                '@media (max-width: 1024px)': {
                    display: 'none',
                },
            },
            '&.Mui-completed .MuiStepLabel-label': {
                color: 'var(--color-foreground) !important',
            },
            '&.Mui-active .MuiStepLabel-label': {
                color: 'var(--color-foreground) !important',
            },
        },
        // Dark mode styles using project's dark class
        'html.dark &': {
            '& .MuiStepLabel-root': {
                '& .MuiStepLabel-label': {
                    color: 'var(--color-foreground)',
                },
                '&.Mui-completed .MuiStepLabel-label': {
                    color: 'var(--color-foreground) !important',
                },
            },
            '& .MuiStepConnector-line': {
                borderColor: 'transparent',
            },
        },
        backgroundColor: 'var(--color-background)',
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