// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { type SharedData } from '@/types';
// import { Head, Link, usePage } from '@inertiajs/react';

// type WelcomePageProps = SharedData & {
//     leftCardImage: string ;
//     rightCardContent: string;
// };

// export default function Welcome_c() {
//     const { auth, leftCardImage, rightCardContent } = usePage<WelcomePageProps>().props;

//     return (
//         <>
//             <Head title="Welcome">
//                 <link rel="preconnect" href="https://fonts.bunny.net" />
//                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
//             </Head>
//             <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
//                 <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
//                     <nav className="flex items-center justify-end gap-4">
//                         {auth.user ? (
//                             <Link
//                                 href={route('dashboard')}
//                                 className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
//                             >
//                                 Dashboard
//                             </Link>
//                         ) : (
//                             <>
//                                 <Link
//                                     href={route('login')}
//                                     className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
//                                 >
//                                     Log in
//                                 </Link>
//                                 <Link
//                                     href={route('register')}
//                                     className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
//                                 >
//                                     Register
//                                 </Link>
//                             </>
//                         )}
//                     </nav>
//                 </header>

//                 <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
//                     <main className="flex w-full max-w-[335px] flex-col-reverse gap-1 lg:max-w-4xl lg:flex-row">
//                         {/* Left Card - Only shows the image */}
//                         <Card className="w-full overflow-hidden bg-[#E6E6E5] p-0 transition-transform duration-300 hover:shadow-lg dark:bg-[#121212]">
//                             <div className="aspect-square w-full">
//                                 <img src={leftCardImage} loading="lazy" alt="Featured content" className="h-full w-full object-cover" />
//                             </div>
//                         </Card>

//                         {/* Right Card - Shows static content */}
//                         <Card className="w-full bg-[#E6E6E5] transition-transform duration-300 hover:shadow-lg dark:bg-[#121212]">
//                             <CardHeader>
//                                 <CardTitle>{rightCardContent}</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <Button className="m-1">Do it your self</Button>
//                                 <Button className="m-1">Let us handle it</Button>
//                             </CardContent>
//                         </Card>
//                     </main>
//                 </div>
//                 <div className="hidden h-14.5 md:block"></div>
//             </div>
//         </>
//     );
// }

// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { type SharedData } from '@/types';
// import { Head, Link, usePage } from '@inertiajs/react';

// type WelcomePageProps = SharedData & {
//     leftCardImage: string[];
//     rightCardContent: string;
// };

// // Map content to image indices
// const contentToImageMap: Record<string, number> = {
//     'First step': 0,
//     'Second step': 1,
//     'Third step': 2,
//     'Fourth step': 3,
//     'Fifth step': 4,
// };

// export default function Welcome_c() {
//     const { auth, leftCardImage, rightCardContent } = usePage<WelcomePageProps>().props;
//     const imageIndex = contentToImageMap[rightCardContent] || 0;

//     return (
//         <>
//             <Head title="Welcome">
//                 <link rel="preconnect" href="https://fonts.bunny.net" />
//                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
//             </Head>
//             <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
//                 {/* Header remains unchanged */}
//                 <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
//                     <nav className="flex items-center justify-end gap-4">
//                         {auth.user ? (
//                             <Link
//                                 href={route('dashboard')}
//                                 className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
//                             >
//                                 Dashboard
//                             </Link>
//                         ) : (
//                             <>
//                                 <Link
//                                     href={route('login')}
//                                     className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
//                                 >
//                                     Log in
//                                 </Link>
//                                 <Link
//                                     href={route('register')}
//                                     className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
//                                 >
//                                     Register
//                                 </Link>
//                             </>
//                         )}
//                     </nav>
//                 </header>

//                 <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
//                     <main className="flex w-full max-w-[335px] flex-col-reverse gap-1 lg:max-w-4xl lg:flex-row">
//                         {/* Left Card - Shows image based on content */}
//                         <Card className="w-full overflow-hidden bg-[#E6E6E5] p-0 transition-transform duration-300 hover:shadow-lg dark:bg-[#121212]">
//                             <div className="aspect-square w-full">
//                                 <img
//                                     src={leftCardImage[imageIndex]}
//                                     loading="lazy"
//                                     alt={`Step ${imageIndex + 1} illustration`}
//                                     className="h-full w-full object-cover"
//                                 />
//                             </div>
//                         </Card>

//                         {/* Right Card - Shows current content */}
//                         <Card className="w-full bg-[#E6E6E5] transition-transform duration-300 hover:shadow-lg dark:bg-[#121212]">
//                             <CardHeader>
//                                 <CardTitle>{rightCardContent}</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <Button className="m-1">Do it yourself</Button>
//                                 <Button className="m-1">Let us handle it</Button>
//                             </CardContent>
//                         </Card>
//                     </main>
//                 </div>
//                 <div className="hidden h-14.5 md:block"></div>
//             </div>
//         </>
//     );
// }


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import FirstPic from "@/assets/Group_1.png";
import SecondPic from "@/assets/Group_1.png";
import ThirdPic from "@/assets/Group_1.png";
import ForthPic from "@/assets/Group_1.png";
import FifthPic from "@/assets/Group_1.png";



type WelcomePageProps = SharedData & {
    rightCardContent: string;
};

const contentToImageMap: Record<string, number> = {
    'First step': 0,
    'Second step': 1,
    'Third step': 2,
    'Fourth step': 3,
    'Fifth step': 4,
};

export default function Welcome_c() {
    const { auth, rightCardContent } = usePage<WelcomePageProps>().props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const targetImageIndex = contentToImageMap[rightCardContent] || 0;

    // Animate through images when content changes
    useEffect(() => {
        if (currentImageIndex !== targetImageIndex) {
            const direction = targetImageIndex > currentImageIndex ? 1 : -1;
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => {
                    const nextIndex = prev + direction;
                    if (nextIndex === targetImageIndex) {
                        clearInterval(interval);
                    }
                    return nextIndex;
                });
            }, 200); // Animation speed in milliseconds
            
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
                        {/* Left Card with Flipping Animation */}
                        <Card className="w-full overflow-hidden bg-[#E6E6E5] p-0 dark:bg-[#121212]">
                            <div className="aspect-square w-full relative">
                                <AnimatePresence mode="popLayout">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ rotateY: 90, opacity: 0 }}
                                        animate={{ rotateY: 0, opacity: 1 }}
                                        exit={{ rotateY: -90, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0"
                                    >
                                        <img
                                            src={imagePaths[currentImageIndex]}
                                            loading="lazy"
                                            alt={`${rightCardContent} illustration`}
                                            className="h-full w-full object-cover"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </Card>

                        {/* Right Card */}
                        <Card className="w-full bg-[#E6E6E5] transition-transform duration-300 hover:shadow-lg dark:bg-[#121212]">
                            <CardHeader>
                                <CardTitle>{rightCardContent}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button className="m-1">Do it yourself</Button>
                                <Button className="m-1">Let us handle it</Button>
                            </CardContent>
                        </Card>
                    </main>
                </div>
                <div className="hidden h-14.5 md:block"></div>
            </div>
        </>
    );
}