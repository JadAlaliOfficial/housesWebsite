import FirstPic from '@/assets/Group_1.png';
import SecondPic from '@/assets/Group_2.png';
import ThirdPic from '@/assets/Group_3.png';
import FourthPic from '@/assets/Group_4.png';
import FifthPic from '@/assets/Group_5.png';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

type StepKey = 'First step' | 'Second step' | 'Third step' | 'Fourth step' | 'Fifth step' | 'Final step';

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

// type WelcomePageProps = SharedData & {
//     rightCardContent: StepKey;
// };
type WelcomePageProps = SharedData & {
    rightCardContent: StepKey;
    status: 'not requested' | 'on hold' | 'done';
};

const imageArray = [FirstPic, SecondPic, ThirdPic, FourthPic, FifthPic];

const contentToImageMap: Record<string, number> = {
    'First step': 0,
    'Second step': 1,
    'Third step': 2,
    'Fourth step': 3,
    'Fifth step': 4,
    'Final step': 4,
};

export default function Welcome_c() {
    const { auth, rightCardContent, status } = usePage<WelcomePageProps>().props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const targetImageIndex = contentToImageMap[rightCardContent] || 0;
    const currentStepContent = stepContentMap[rightCardContent];

    // Elevator-style animation
    useEffect(() => {
        if (currentImageIndex !== targetImageIndex) {
            const newDirection = targetImageIndex > currentImageIndex ? 1 : -1;
            setDirection(newDirection);

            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => {
                    const nextIndex = prev + newDirection;
                    if (nextIndex === targetImageIndex) {
                        clearInterval(interval);
                    }
                    return nextIndex;
                });
            }, 200);

            return () => clearInterval(interval);
        }
    }, [targetImageIndex]);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                {/* Add header with logout button */}
                <header className="mb-6 w-full max-w-[1200px] text-sm">
                    <nav className="flex items-center justify-end gap-4">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-2 rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Link>
                    </nav>
                </header>
                
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex h-[80vh] w-full flex-col-reverse gap-1 lg:w-[90vw] lg:max-w-[1200px] lg:flex-row">
                        <Card className="h-full w-full overflow-hidden bg-[#E6E6E5] p-0 lg:w-2/3 dark:bg-[#121212]">
                            <div className="relative h-full w-full overflow-hidden">
                                <AnimatePresence custom={direction}>
                                    <motion.div
                                        key={currentImageIndex}
                                        custom={direction}
                                        initial={{ y: direction * 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: direction * -100, opacity: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                        className="absolute inset-0"
                                    >
                                        <img
                                            src={imageArray[currentImageIndex]}
                                            loading="lazy"
                                            alt={`${rightCardContent} illustration`}
                                            className="h-full w-full object-cover"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </Card>
                        {/* <Card className="h-full w-full overflow-y-auto bg-[#E6E6E5] transition-transform duration-300 hover:shadow-lg lg:w-1/3 dark:bg-[#121212]">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{currentStepContent.header}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {currentStepContent.content.split('\n').map((paragraph: string, i: number) => (
                                        <p key={i} className="mb-3 last:mb-0">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <Button className="min-w-[120px]">Do it yourself</Button>
                                    <Button className="min-w-[120px]" variant="outline">
                                        Let us handle it
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
                            </CardContent>
                        </Card> */}
                        <Card className="flex h-full w-full flex-col bg-[#E6E6E5] transition-transform duration-300 hover:shadow-lg lg:w-1/3 dark:bg-[#121212]">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{currentStepContent.header}</CardTitle>
                            </CardHeader>

                            {/* Scrollable content area */}
                            <div className="flex-1 overflow-y-auto px-6 pb-4">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {currentStepContent.content.split('\n').map((paragraph: string, i: number) => (
                                        <p key={i} className="mb-3 last:mb-0">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Fixed bottom section */}
                            <div className="p-6 pt-0">
                                <div className="flex flex-wrap gap-2">
                                    <Button className="min-w-[120px]">Do it yourself</Button>
                                    <Button className="min-w-[120px]" variant="outline">
                                        Let us handle it
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
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        </>
    );
}
