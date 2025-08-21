import WebsiteIcon from '@/assets/logo.png';
import { Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { type User } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';

interface HeaderProps {
    auth: {
        user: User | null;
    };
    darkMode: boolean;
    toggleDarkMode: () => void;
    file?: {
        id?: number;
        fileLink: string | null;
    } | null;
}

export default function Header({ auth, darkMode, toggleDarkMode, file}: HeaderProps) {
    const fileLink = file?.fileLink ?? null;
    const downloadUrl = fileLink
        ? (fileLink.startsWith('http') ? fileLink : `/storage/${fileLink}`)
        : null;
    const fileName = fileLink ? fileLink.split('/').pop() ?? 'file.pdf' : '';
    return (
        <header className="mb-2 w-full max-w-[1200px]">
            <nav className="flex w-full items-center justify-between">
                <div className="flex items-center">
                    <img src={WebsiteIcon} alt="Website Logo" className="h-[8vh] w-auto" />
                    {downloadUrl && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={downloadUrl}
                                        download
                                        aria-label={`Download ${fileName}`}
                                        className="ml-3 inline-flex items-center rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 dark:hover:bg-gray-800"
                                    >
                                        <AlertCircle className="h-5 w-5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download {fileName}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                {/* Navigation buttons on the far right */}
                <div className="flex items-center gap-4">
                    {auth.user ? (
                        auth.user.stage === 0 ? (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border border-welcome-border px-5 py-1.5 text-sm leading-normal text-welcome-foreground hover:border-welcome-border dark:border-welcome-border dark:text-welcome-foreground dark:hover:border-welcome-border"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-2 rounded-sm border border-welcome-border px-5 py-1.5 text-sm leading-normal text-welcome-foreground hover:border-welcome-border dark:border-welcome-border dark:text-welcome-foreground dark:hover:border-welcome-border"
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
                                className="inline-flex items-center gap-2 rounded-sm border border-welcome-border px-5 py-1.5 text-sm leading-normal text-welcome-foreground hover:border-welcome-border dark:border-welcome-border dark:text-welcome-foreground dark:hover:border-welcome-border"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Link>
                        )
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-welcome-foreground hover:border-welcome-border dark:text-welcome-foreground dark:hover:border-welcome-border"
                        >
                            Log in
                        </Link>
                    )}
                    
                    {/* Dark mode toggle button */}
                    <button
                        onClick={toggleDarkMode}
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-welcome-border text-welcome-foreground transition-colors hover:border-welcome-border dark:border-welcome-border dark:text-welcome-foreground dark:hover:border-welcome-border"
                        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
}