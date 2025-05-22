import { Box, Step, StepLabel, Stepper } from '@mui/material';

interface StepperSectionProps {
    activeStep: number;
    steps: { label: string }[];
}

export default function StepperSection({ activeStep, steps }: StepperSectionProps) {
    return (
        <div className="sticky top-0 z-10 w-full max-w-[1200px] bg-[#E6E6E6] px-4 py-4 dark:bg-[#0a0a0a]">
            <Box sx={{ width: '100%' }}>
                <Stepper
                    activeStep={activeStep}
                    orientation="horizontal"
                    sx={{
                        '& .MuiStepConnector-root': {
                            top: 12,
                        },
                        '& .MuiStepConnector-line': {
                            borderColor: '#d1d5db',
                        },
                        'html.dark & .MuiStepConnector-line': {
                            borderColor: '#374151',
                        },
                        '& .Mui-completed .MuiStepConnector-line': {
                            borderColor: '#031038',
                        },
                        '& .MuiStepLabel-root': {
                            '& .MuiStepLabel-label': {
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#1f2937',
                                '@media (max-width: 1024px)': {
                                    display: 'none',
                                },
                            },
                            '&.Mui-completed .MuiStepLabel-label': {
                                color: '#031038 !important',
                            },
                            '&.Mui-active .MuiStepLabel-label': {
                                color: '#3b82f6 !important',
                            },
                        },
                        // Dark mode styles using project's dark class
                        'html.dark &': {
                            '& .MuiStepLabel-root': {
                                '& .MuiStepLabel-label': {
                                    color: '#E6E6E6', // Text color in dark mode
                                },
                                '&.Mui-completed .MuiStepLabel-label': {
                                    color: '#3b82f6 !important', // Completed step color in dark mode
                                },
                            },
                            '& .MuiStepConnector-line': {
                                borderColor: '#374151', // Line color in dark mode
                            },
                        },
                    }}
                >
                    {steps.map((stepItem) => (
                        <Step key={stepItem.label}>
                            <StepLabel>{stepItem.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </div>
    );
}