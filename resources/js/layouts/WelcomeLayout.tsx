import AppLogo from '@/assets/logo.png';
import Header from '@/components/welcomePage/Header';
import StepperSection from '@/components/welcomePage/StepperSection';
import { type SharedData, type User, type Stage } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState, ReactNode } from 'react';

type WelcomeLayoutProps = {
  children: ReactNode;
  title?: string;
};

type WelcomePageData = SharedData & {
  user: User;
  stages: Stage[];
};

export default function WelcomeLayout({ children, title = 'Roadmap' }: WelcomeLayoutProps) {
  const { auth, user, stages } = usePage<WelcomePageData>().props;
  
  // Dark mode state and logic
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
  
  // Create step labels from stages data
  const stepLabels = stages.map(stage => ({ label: stage.name }));
  
  // Get the active step index (0-based)
  const activeStep = Math.max(0, Number(user.stage) - 1);
  
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
      <Head title={title}>
        {/* <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" /> */}
        <link rel="icon" href={AppLogo} type="image/png" />
      </Head>
      <div className="flex min-h-screen flex-col items-center bg-[#E6E6E6] p-4 text-[#0a0a0a] lg:justify-center lg:p-4 dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
        <Header auth={auth} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex w-full flex-col items-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          {/* Horizontal Stepper */}
          <StepperSection activeStep={activeStep} steps={stepLabels} />

          {/* Main content area */}
          <main className="mt-5 flex w-full max-w-[1200px] flex-col gap-2 md:items-center lg:h-[69vh] lg:w-[90vw] lg:flex-row lg:items-stretch">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}