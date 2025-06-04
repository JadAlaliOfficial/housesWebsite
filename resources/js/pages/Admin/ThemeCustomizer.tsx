import Preview from '@/components/preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = Record<string, string>;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Theme Customizer', href: '#' },
];

export default function ThemeCustomizer() {
    const {
        theme: { light, dark },
    } = usePage<{ theme: { light: Theme; dark: Theme } }>().props;

    const [lightState, setLight] = useState<Theme>(light);
    const [darkState, setDark] = useState<Theme>(dark);

    const { appearance, updateAppearance } = useAppearance();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkMode =
            appearance === 'dark' ||
            (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(darkMode);
    }, [appearance]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post(route('admin.theme'), { light: lightState, dark: darkState });
    }

    const filterWelcomeColors = (obj: Theme) => {
        return Object.fromEntries(Object.entries(obj).filter(([key]) => key.startsWith('welcome-')));
    };

    const renderInputs = (obj: Theme, setter: (v: Theme) => void) =>
        Object.entries(filterWelcomeColors(obj)).map(([key, val]) => {
            const isColorInput = /^#([0-9A-Fa-f]{3}){1,2}$/.test(val);

            return (
                <div key={key} className="mb-4">
                    <label className="mb-1 block text-sm font-medium">{key}</label>
                    <input
                        type={isColorInput ? 'color' : 'text'}
                        value={val}
                        onChange={(e) => setter({ ...obj, [key]: e.target.value })}
                        className={`w-full rounded border px-2 py-1 ${isColorInput ? 'h-10 w-10 p-0' : ''}`}
                    />
                </div>
            );
        });

    const toggleThemeView = () => {
        const newAppearance = isDarkMode ? 'light' : 'dark';
        updateAppearance(newAppearance);

        // Force a full page refresh after a short delay to ensure the theme is applied
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Theme Customizer" />
            <div className="flex h-full flex-1 flex-col gap-4 bg-[#E6E6E6] p-4 text-[#0a0a0a] dark:bg-[#0a0a0a] dark:text-[#E6E6E6]">
                <Card className="bg-white dark:border-[#3E3E3A] dark:bg-[#121212]">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Theme Customizer</CardTitle>
                                <CardDescription>Set your light and dark palette</CardDescription>
                            </div>
                            <Toggle
                                pressed={isDarkMode}
                                onPressedChange={toggleThemeView}
                                aria-label="Toggle theme view"
                                className="bg-accent hover:bg-accent h-10 rounded-xl px-3"
                            >
                                {isDarkMode ? (
                                    <>
                                        <Moon className="mr-2 h-5 w-5" />
                                        <span>Dark Theme</span>
                                    </>
                                ) : (
                                    <>
                                        <Sun className="mr-2 h-5 w-5" />
                                        <span>Light Theme</span>
                                    </>
                                )}
                            </Toggle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {!isDarkMode ? (
                                <section>
                                    <div className="mb-4">
                                        <h2 className="mb-4 text-lg font-semibold">Light Theme</h2>
                                        <div className="grid grid-cols-3 gap-4">{renderInputs(lightState, setLight)}</div>
                                    </div>
                                    <div>
                                        <Preview />
                                    </div>
                                </section>
                            ) : (
                                <section>
                                    <div className="mb-4">
                                        <h2 className="mb-4 text-lg font-semibold">Dark Theme</h2>
                                        <div className="grid grid-cols-3 gap-4">{renderInputs(darkState, setDark)}</div>
                                    </div>
                                    <div>
                                        <Preview />
                                    </div>
                                </section>
                            )}

                            <Button type="submit" className="bg-accent hover:bg-accent mt-4 rounded-xl">
                                Save Theme
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
