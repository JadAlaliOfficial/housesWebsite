import FirstPic from '@/assets/Group_1.png';
import WebsiteIcon from '@/assets/Group_1.svg';
import SecondPic from '@/assets/Group_2.jpg';
import ThirdPic from '@/assets/Group_3.jpg';
import FourthPic from '@/assets/Group_4.jpg';
import { default as FifthPic, default as FinalPic } from '@/assets/Group_5.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Box, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

type StepKey = 'First step' | 'Second step' | 'Third step' | 'Fourth step' | 'Fifth step' | 'Final step';
type Status = 'not requested' | 'on hold' | 'done';

interface StepContent {
    header: string;
    content: string;
}

const stepContentMap: Record<StepKey, StepContent> = {
    'First step': {
        header: 'Meet your builder and design your home',
        content: 'This is where your journey begins!...',
    },
    'Second step': {
        header: 'Plumbing Company',
        content:
            "Let's get the water flowing — time to choose your sinks, tubs, faucets, and more! Whether you're after sleek modern vibes or cozy traditional touches, your plumbing choices will bring both function and flair to your new home. Bonus: water-saving options to go eco-friendly!\n\nYou've got two easy ways to choose:\n1- Visit our trusted plumbing company and explore options in person.\n2- Check out the curated plumbing packages uploaded to your account in our software — browse, compare, and pick what you love anytime!\n\nYour style, your pace, your home. Let's do this!",
    },
    'Third step': {
        header: 'Light Fixture Company (Set the Mood)',
        content:
            "It's your time to shine! From statement chandeliers to soft, cozy lighting — this step helps you create the perfect ambiance in every room. Explore finishes, styles, and smart lighting options that match your personality and lifestyle. Let your home glow!\n\nYou have two great ways to choose:\n1- Visit our lighting company partner to see fixtures up close and get personalized guidance.\n2- Browse the pre-selected lighting packages we've uploaded to your account in our software, easy, convenient, and full of stylish options!\n\nLight it up your way!",
    },
    'Fourth step': {
        header: 'Countertop Company – Style Meets Function',
        content:
            "Ready to add that wow factor? It's time to meet with the countertop company and explore stunning materials like quartz, granite, or marble. Your consultant will guide you through the options, helping you match style with durability — so you get something beautiful and built to last. It's where everyday function meets standout design!",
    },
    'Fifth step': {
        header: 'Cabinet Company – The Heart of Your Home',
        content:
            "Time to get organized — beautifully! You'll meet with the cabinet company to select your cabinet design, finish, color, and hardware. Together, you'll create a kitchen and bathroom that's both practical and picture-perfect. Whether you're going for classic charm or sleek minimalism, this is where the magic truly happens.",
    },
    'Final step': {
        header: 'Key Handed – Welcome Home!',
        content:
            "You made it! It's time to receive your keys and step into your brand new home. Enjoy a final walkthrough, get helpful info and documents, and celebrate the big moment. This is the start of your next chapter — welcome home!",
    },
};

type WelcomePageProps = SharedData & {
    user: User;
};

const imageArray = [FirstPic, SecondPic, ThirdPic, FourthPic, FifthPic, FinalPic];

const getStepAndStatus = (stage: number): { step: StepKey; status: Status } => {
    const stepMap: Record<number, StepKey> = {
        1: 'First step',
        2: 'Second step',
        2.5: 'Second step',
        3: 'Third step',
        3.5: 'Third step',
        4: 'Fourth step',
        4.5: 'Fourth step',
        5: 'Fifth step',
        5.5: 'Fifth step',
        6: 'Final step',
    };

    const statusMap: Record<number, Status> = {
        1: 'not requested',
        2: 'not requested',
        2.5: 'on hold',
        3: 'not requested',
        3.5: 'on hold',
        4: 'not requested',
        4.5: 'on hold',
        5: 'not requested',
        5.5: 'on hold',
        6: 'done',
    };

    return {
        step: stepMap[stage] || 'First step',
        status: statusMap[stage] || 'not requested',
    };
};

export default function Welcome_c() {
    const { auth, user } = usePage<WelcomePageProps>().props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [processing, setProcessing] = useState(false);

    const steps = [
        {
            label: 'Meet your builder and design your home',
        },
        {
            label: 'Choose plumbing fixtures and features',
        },
        {
            label: 'Select lighting fixtures and setup',
        },
        {
            label: 'Pick countertop materials and design',
        },
        {
            label: 'Design and choose cabinetry',
        },
        {
            label: 'Receive keys and final walkthrough',
        },
    ];

    // Modified to handle the final step as completed
    const activeStep = user.stage === 6 ? steps.length : Math.floor(Number(user.stage)) - 1;

    const { step, status } = getStepAndStatus(Number(user.stage));
    const currentStepContent = stepContentMap[step];

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

    // Map step to image index
    const stepToImageIndex: Record<StepKey, number> = {
        'First step': 0,
        'Second step': 1,
        'Third step': 2,
        'Fourth step': 3,
        'Fifth step': 4,
        'Final step': 5,
    };

    const targetImageIndex = stepToImageIndex[step] || 0;

    useEffect(() => {
        if (currentImageIndex !== targetImageIndex) {
            const newDirection = targetImageIndex > currentImageIndex ? 1 : -1;
            setDirection(newDirection);

            // Calculate total number of steps needed
            const totalSteps = Math.abs(targetImageIndex - currentImageIndex);
            // Use a consistent transition time per image
            const intervalTime = 700;

            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => {
                    const nextIndex = prev + newDirection;
                    if (nextIndex === targetImageIndex) {
                        clearInterval(interval);
                    }
                    return nextIndex;
                });
            }, intervalTime);

            return () => clearInterval(interval);
        }
    }, [targetImageIndex]);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-4 text-[#1b1b18] lg:justify-center lg:p-4 dark:bg-[#0a0a0a]">
                <header className="mb-2 w-full max-w-[1200px]">
                    <nav className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src={WebsiteIcon}
                                alt="Website Logo"
                                className="h-[6vh] w-auto" // Adjust size as needed
                            />
                        </div>
                        {/* Navigation buttons on the far right */}
                        <div className="flex gap-4">
                            {auth.user ? (
                                auth.user.stage === 0 ? (
                                    <>
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="inline-flex items-center gap-2 rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="inline-flex items-center gap-2 rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Link>
                                )
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>
                <div className="flex w-full flex-col items-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    {/* Horizontal Stepper */}
                    <div className="sticky top-0 z-10 w-full max-w-[1200px] px-4 py-4 bg-[#FDFDFC] dark:bg-[#0a0a0a] shadow-sm">
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
                                        '@media (prefers-color-scheme: dark)': {
                                            borderColor: '#374151',
                                        },
                                    },
                                    '& .Mui-completed .MuiStepConnector-line': {
                                        borderColor: '#10b981',
                                    },
                                    '& .MuiStepLabel-root': {
                                        '& .MuiStepLabel-label': {
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: '#1f2937',
                                            // Hide labels on screens smaller than lg
                                            '@media (max-width: 1024px)': {
                                                display: 'none',
                                            },
                                        },
                                        '&.Mui-completed .MuiStepLabel-label': {
                                            color: '#10b981 !important',
                                        },
                                        '&.Mui-active .MuiStepLabel-label': {
                                            color: '#3b82f6 !important',
                                        },
                                    },
                                    '@media (prefers-color-scheme: dark)': {
                                        '& .MuiStepLabel-root': {
                                            '& .MuiStepLabel-label': {
                                                color: 'white',
                                            },
                                            '&.Mui-completed .MuiStepLabel-label': {
                                                color: '#10b981 !important',
                                            },
                                            '&.Mui-active .MuiStepLabel-label': {
                                                color: '#3b82f6 !important',
                                            },
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

                    {/* Image and Content Cards */}
                    <main className="flex w-full max-w-[1200px] mt-5 flex-col md:items-center lg:items-stretch gap-2 lg:flex-row">
                        {/* Image Card */}
                        <Card className="w-full flex-1 h-full bg-[#E6E6E5] p-0 md:w-1/2 lg:w-2/3 dark:bg-[#121212]">
                            <div className="relative w-full h-full overflow-hidden" style={{ maxHeight: '400px' }}>
                                <AnimatePresence custom={direction}>
                                    <motion.div
                                        key={currentImageIndex}
                                        custom={direction}
                                        initial={{ y: direction * 300, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: direction * -300, opacity: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 100,
                                            damping: 25,
                                            mass: 1.2,
                                        }}
                                        className="flex items-center justify-center h-full"
                                    >
                                        <img
                                            src={imageArray[currentImageIndex]}
                                            loading="lazy"
                                            alt={`${step} illustration`}
                                            className="w-full rounded-lg object-contain"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </Card>

                        {/* Content Card */}
                        <Card className="w-full flex-1 flex flex-col bg-[#E6E6E5] p-6 md:w-1/2 lg:w-1/3 lg:h-[400px] dark:bg-[#121212]">
                            <CardHeader className="p-0 pb-4">
                                <CardTitle className="text-lg font-semibold">{currentStepContent.header}</CardTitle>
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
                                user.stage === 6 ? null : (
                                    /* Normal case for other steps */
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                className={`min-w-[120px] ${status === 'on hold' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                disabled={status === 'on hold' || processing}
                                                onClick={() => handleMoveToNextStage(user, 'self')}
                                            >
                                                {processing ? 'Processing...' : 'Do it yourself'}
                                            </Button>
                                            <Button
                                                className={`min-w-[120px] ${status === 'on hold' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                disabled={status === 'on hold' || processing}
                                                onClick={() => handleMoveToNextStage(user, 'assisted')}
                                            >
                                                {processing ? 'Processing...' : 'Let us handle it'}
                                            </Button>
                                        </div>
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
                    </main>
                </div>
            </div>
        </>
    );
}
