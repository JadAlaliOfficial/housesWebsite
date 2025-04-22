import WebsiteIcon from '@/assets/logo.png';
import FirstPicForDesktop from '@/assets/d/d_1.png';
import SecondPicForDesktop from '@/assets/d/d_2.png';
import ThirdPicForDesktop from '@/assets/d/d_3.png';
import FourthPicForDesktop from '@/assets/d/d_4.png';
import FifthPicForDesktop from '@/assets/d/d_5.png';
import FinalPicForDesktop from '@/assets/d/d_6.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Box, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type StepKey = 'First step' | 'Second step' | 'Third step' | 'Fourth step' | 'Fifth step' | 'Final step';
type Status = 'not requested' | 'on hold' | 'done';

interface StepContent {
    header: string;
    subheader?: string;
    content: string;
}

const stepContentMap: Record<StepKey, StepContent> = {
    'First step': {
        header: 'Meet your builder and design your home',
        subheader: 'This is where your journey begins!',
        content:
            "You'll sit down with your builder to discuss your vision, needs, and budget. Bring any inspiration photos or ideas you have — this is the time to explore layouts, room count, and style preferences. You'll walk away with a clear plan and timeline. Get ready for your journey 🚀",
    },
    'Second step': {
        header: 'Plumbing Company',
        subheader: "Let's get the water flowing",
        content:
            "time to choose your sinks, tubs, faucets, and more! Whether you're after sleek modern vibes or cozy traditional touches, your plumbing Choices will bring both function and flair to your new home.\n\nYour style, your pace, your home. Let's do this!💪",
    },
    'Third step': {
        header: 'Light Fixture Company',
        subheader: 'Set the Mood',
        content:
            'From statement chandeliers to soft, cozy lighting, this step helps you create the perfect ambiance in every room. Explore finishes, styles, and smart lighting options that match your personality and lifestyle.\n\nLet your home glow!🌟',
    },
    'Fourth step': {
        header: 'Countertop Company',
        subheader: 'Get ready to add that WOW factor',
        content:
            "It's time to meet with the countertop company and explore stunning materials like quartz, granite, or marble. Your consultant will guide you through the options, helping you match style with durability, so you get something beautiful and built to last.\n\nIt's where everyday function meets standout design!🏡🔨",
    },
    'Fifth step': {
        header: 'Cabinet Company',
        subheader: 'Time to get organized — beautifully!🧁🛠️',
        content:
            "You'll meet with the cabinet company to select your cabinet design, finish, color, and hardware. Together, you'll create a kitchen and bathroom that's both practical and picture-perfect.\n\nWhether you're going for classic charm or sleek minimalism, this is where the magic truly happens.✨",
    },
    'Final step': {
        header: 'Key Handed',
        subheader: 'Welcome Home!',
        content:
            "You made it!🎉🏡 It's time to receive your keys and step into your brand new home. Enjoy a final walkthrough, get helpful info and documents, and celebrate the big moment. This is the start of your next chapter — welcome home!🥂🔑",
    },
};

type WelcomePageProps = SharedData & {
    user: User;
};

const imageArray = [FirstPicForDesktop, SecondPicForDesktop, ThirdPicForDesktop, FourthPicForDesktop, FifthPicForDesktop, FinalPicForDesktop];

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
    const [showSelfTooltip, setShowSelfTooltip] = useState(false);
    const [showAssistedTooltip, setShowAssistedTooltip] = useState(false);
    // Add state for mobile tooltips
    const [showSelfMobileInfo, setShowSelfMobileInfo] = useState(false);
    const [showAssistedMobileInfo, setShowAssistedMobileInfo] = useState(false);
    const selfButtonRef = useRef<HTMLButtonElement>(null);
    const assistedButtonRef = useRef<HTMLButtonElement>(null);

    const steps = [
        {
            label: 'Meet your builder and design your home',
        },
        {
            label: 'Plumbing Company ',
        },
        {
            label: 'Light Fixture Company',
        },
        {
            label: 'Countertop Company',
        },
        {
            label: ' Cabinet Company ',
        },
        {
            label: 'Key Handed – Welcome Home!',
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

    // Set the image index with animation
    useEffect(() => {
        // Determine direction based on current and target index
        const newDirection = targetImageIndex > currentImageIndex ? 1 : -1;
        setDirection(newDirection);
        setCurrentImageIndex(targetImageIndex);
    }, [targetImageIndex]);

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
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f1f1f1] p-4 text-[#1b1b18] lg:justify-center lg:p-4 dark:bg-[#0a0a0a]">
                <header className="mb-2 w-full max-w-[1200px]">
                    <nav className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                            <img src={WebsiteIcon} alt="Website Logo" className="h-[6vh] w-auto" />
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
                    <div className="sticky top-0 z-10 w-full max-w-[1200px] bg-[#f1f1f1] px-4 py-4 dark:bg-[#0a0a0a]">
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
                    <main className="mt-5 flex w-full max-w-[1200px] flex-col gap-2 md:items-center lg:h-[69vh] lg:w-[90vw] lg:flex-row lg:items-stretch">
                        {/* Image Card */}
                        <Card className="h-full w-full flex-1 bg-[#E6E6E5] p-0 md:w-1/2 lg:w-1/2 dark:bg-[#121212]">
                            <div className="relative h-full w-full overflow-hidden">
                                <div className="flex h-full w-full items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentImageIndex}
                                            src={imageArray[currentImageIndex]}
                                            loading="lazy"
                                            alt={`${step} illustration`}
                                            className="h-full w-full rounded-lg object-cover"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                        />
                                    </AnimatePresence>
                                </div>
                            </div>
                        </Card>

                        {/* Content Card */}
                        <Card className="flex w-full flex-1 flex-col bg-[#cccccc] p-6 md:w-1/2 lg:h-auto lg:w-1/2 dark:bg-[#121212]">
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
                                user.stage === 6 ? null : (
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
                                                {/* Info button for mobile */}

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
                    </main>
                </div>
            </div>
        </>
    );
}
