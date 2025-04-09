import FirstPic from '@/assets/Group_1.png';
import SecondPic from '@/assets/Group_2.png';
import ThirdPic from '@/assets/Group_3.png';
import FourthPic from '@/assets/Group_4.png';
import FifthPic from '@/assets/Group_5.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type WelcomePageProps = SharedData & {
    rightCardContent: string;
};

const imageArray = [FirstPic, SecondPic, ThirdPic, FourthPic, FifthPic];

const stepContentMap = {
    'First step': {
        header: 'Meet your builder and design your home',
        content:
            "This is where your journey begins! You'll sit down with your builder to discuss your vision, needs, and budget. Bring any inspiration photos or ideas you have — this is the time to explore layouts, room count, and style preferences. You'll walk away with a clear plan and timeline. Get ready for your journey",
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

const contentToImageMap: Record<string, number> = {
    'First step': 0,
    'Second step': 1,
    'Third step': 2,
    'Fourth step': 3,
    'Fifth step': 4,
    'Final step': 4,
};

export default function Welcome_c() {
    const { auth, rightCardContent } = usePage<WelcomePageProps>().props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const targetImageIndex = contentToImageMap[rightCardContent] || 0;
    const currentStepContent = stepContentMap[rightCardContent] || stepContentMap['First step'];

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
                {/* Header remains unchanged */}

                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse gap-1 lg:max-w-4xl lg:flex-row">
                        {/* Left Card with Elevator Animation */}
                        <Card className="w-full overflow-hidden bg-[#E6E6E5] p-0 dark:bg-[#121212]">
                            <div className="relative aspect-square w-full overflow-hidden">
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

                        {/* Right Card with Step-Specific Content */}
                        <Card className="w-full bg-[#E6E6E5] transition-transform duration-300 hover:shadow-lg dark:bg-[#121212]">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{currentStepContent.header}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {/* {currentStepContent.content.split('\n').map((paragraph, i) => (
                                        <p key={i} className="mb-3 last:mb-0">
                                            {paragraph}
                                        </p>
                                    ))} */}
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
                            </CardContent>
                        </Card>
                    </main>
                </div>
                <div className="hidden h-14.5 md:block"></div>
            </div>
        </>
    );
}
