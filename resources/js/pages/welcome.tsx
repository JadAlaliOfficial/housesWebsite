import FirstPicForDesktop from '@/assets/d/d_1.png';
import SecondPicForDesktop from '@/assets/d/d_2.png';
import ThirdPicForDesktop from '@/assets/d/d_3.png';
import FourthPicForDesktop from '@/assets/d/d_4.png';
import FifthPicForDesktop from '@/assets/d/d_5.png';
import SixthPicForDesktop from '@/assets/d/d_6.jpg';
import FinalPicForDesktop from '@/assets/d/d_7.jpg'; // Updated to d_7.jpg for the final step
import AppLogo from '@/assets/logo.png';
import Header from '@/components/welcomePage/Header';
import StepperSection from '@/components/welcomePage/StepperSection';
import ImageCard from '@/components/welcomePage/ImageCard';
import ContentCard from '@/components/welcomePage/ContentCard';
import { imageArray } from '@/data/images';
import { stepContentMap, stepLabels, getStepAndStatus, stepToImageIndex } from '@/data/steps';
import { type SharedData, type User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type WelcomePageProps = SharedData & {
    user: User;
};

export default function Welcome_c() {
    const { auth, user } = usePage<WelcomePageProps>().props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [darkMode, setDarkMode] = useState(() => {
        // Check if user preference is stored in localStorage
        const savedMode = localStorage.getItem('darkMode');
        // Return true if saved as 'true', or check system preference as fallback
        return savedMode ? savedMode === 'true' : 
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    // Toggle dark mode function
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));
    };
    
    // Modified to handle the final step as completed
    // Updated to account for the new 6th step, making the final step 7
    const activeStep = user.stage === 7 ? stepLabels.length : Math.floor(Number(user.stage)) - 1;

    const { step, status } = getStepAndStatus(Number(user.stage));
    const currentStepContent = stepContentMap[step];

    const targetImageIndex = stepToImageIndex[step] || 0;

    // Set the image index with animation
    useEffect(() => {
        // Determine direction based on current and target index
        const newDirection = targetImageIndex > currentImageIndex ? 1 : -1;
        setDirection(newDirection);
        setCurrentImageIndex(targetImageIndex);
    }, [targetImageIndex]);

    // Apply dark mode class to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <>
            <Head title="Roadmap">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <link rel="icon" href={AppLogo}  type="image/png" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#E6E6E6] p-4 text-[#0a0a0a] lg:justify-center lg:p-4 dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
                <Header auth={auth} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <div className="flex w-full flex-col items-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    {/* Horizontal Stepper - Now using the StepperSection component */}
                    <StepperSection activeStep={activeStep} steps={stepLabels} />

                    {/* Image and Content Cards */}
                    <main className="mt-5 flex w-full max-w-[1200px] flex-col gap-2 md:items-center lg:h-[69vh] lg:w-[90vw] lg:flex-row lg:items-stretch">
                        {/* Image Card - Now using the ImageCard component */}
                        <ImageCard 
                            currentImageIndex={currentImageIndex}
                            imageArray={imageArray}
                            step={step}
                        />

                        {/* Content Card - Now using the ContentCard component */}
                        <ContentCard
                            currentStepContent={currentStepContent}
                            user={user}
                            step={step}
                            status={status}
                        />
                    </main>
                </div>
            </div>
        </>
    );
}
