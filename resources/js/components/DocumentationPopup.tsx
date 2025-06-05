import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useRef } from 'react';

interface DocumentationPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DocumentationPopup({ isOpen, onClose }: DocumentationPopupProps) {
    const scrollAreaRefs = {
        dashboard: useRef<HTMLDivElement>(null),
        stages: useRef<HTMLDivElement>(null),
        theme: useRef<HTMLDivElement>(null)
    };

    const handleTabChange = (value: string) => {
        // Reset scroll position for all tabs
        Object.values(scrollAreaRefs).forEach(ref => {
            if (ref.current) {
                ref.current.scrollTop = 0;
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] bg-white dark:bg-[#121212] border-[#3E3E3A]">
                <DialogHeader>
                    <DialogTitle className="text-[#0a0a0a] dark:text-[#E6E6E6]">Project Documentation</DialogTitle>
                    <DialogDescription className="dark:text-gray-300">
                        Overview of the Houses Website project features and workflows. <a href='https://www.loom.com/share/74566aa4cabb4ab5a8efb8ffb13b68d9?sid=87ced571-37cc-40b2-b4e1-b4c5e2eb27a8' target='_blank' rel='noopener noreferrer' className="text-blue-500 hover:underline">watch the loom</a>
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="dashboard" className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-3 bg-[#E6E6E6] dark:bg-[#0a0a0a]">
                        <TabsTrigger 
                            value="dashboard" 
                            className="data-[state=active]:bg-white data-[state=active]:text-[#0a0a0a] dark:data-[state=active]:bg-[#121212] dark:data-[state=active]:text-[#E6E6E6]"
                        >
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger 
                            value="stages" 
                            className="data-[state=active]:bg-white data-[state=active]:text-[#0a0a0a] dark:data-[state=active]:bg-[#121212] dark:data-[state=active]:text-[#E6E6E6]"
                        >
                            Stages
                        </TabsTrigger>
                        <TabsTrigger 
                            value="theme" 
                            className="data-[state=active]:bg-white data-[state=active]:text-[#0a0a0a] dark:data-[state=active]:bg-[#121212] dark:data-[state=active]:text-[#E6E6E6]"
                        >
                            Theme
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="dashboard" className="mt-4">
                        <ScrollArea ref={scrollAreaRefs.dashboard} className="h-[calc(80vh-150px)] pr-6">
                            <div className="flex flex-col rounded-lg bg-white dark:bg-[#121212] p-6 border border-[#3E3E3A]">
                                <div className="mb-6 flex items-center justify-between border-b border-[#3E3E3A] pb-4">
                                    <h2 className="text-3xl font-bold text-[#0a0a0a] dark:text-[#E6E6E6]">Dashboard Documentation</h2>
                                </div>
                                <div className="space-y-8 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                    <section>
                                        <h3 className="mb-3 text-2xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">Main Page Dashboard</h3>
                                        <p className="leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            The main dashboard serves as the central hub for managing users and their progression through various stages.
                                            It provides quick access to essential functions and an overview of all user activity.
                                        </p>
                                    </section>

                                    <section>
                                        <h4 className="mb-3 text-xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">Action Buttons</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <strong className="mb-1 block text-[#0a0a0a] dark:text-[#E6E6E6]">Add User:</strong>
                                                <p className="border-l-2 border-[#3E3E3A] pl-4 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                                    Clicking this button opens a form allowing you to enter the information for a new user, adding them to
                                                    the system.
                                                </p>
                                            </div>
                                            <div>
                                                <strong className="mb-1 block text-[#0a0a0a] dark:text-[#E6E6E6]">Temp Reset Link:</strong>
                                                <p className="border-l-2 border-[#3E3E3A] pl-4 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                                    This action generates a temporary password reset URL and copies it to your clipboard. You can then
                                                    share this link with a user if they need to reset their password.
                                                </p>
                                            </div>
                                            <div>
                                                <strong className="mb-1 block text-[#0a0a0a] dark:text-[#E6E6E6]">Temp Register Link:</strong>
                                                <p className="border-l-2 border-[#3E3E3A] pl-4 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                                    This action generates a temporary registration URL and copies it to your clipboard. You can then
                                                    share this link with a user if they need to register.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="mb-3 text-xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">User Information Table</h4>
                                        <p className="mb-4 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            The table displays a list of all users with the following columns:
                                        </p>
                                        <ul className="list-inside list-disc space-y-3 pl-4 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            <li>
                                                <strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">ID:</strong> Unique identifier for the user.
                                            </li>
                                            <li>
                                                <strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Name:</strong> The user's name.
                                            </li>
                                            <li>
                                                <strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Email:</strong> The user's email address.
                                            </li>
                                            <li>
                                                <strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Stage:</strong> The current stage the user is in.
                                            </li>
                                            <li className="space-y-1">
                                                <strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Status:</strong> The user's current status within their
                                                stage, indicated by color:
                                                <ul className="mt-2 list-inside list-disc space-y-1 pl-8 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                                    <li>
                                                        <span className="rounded-md bg-red-600 px-2 py-0.5 font-semibold text-red-100">
                                                            Not Requested
                                                        </span>
                                                        : Indicates the user has not yet made any choices or taken action in the current stage.
                                                    </li>
                                                    <li>
                                                        <span className="rounded-md bg-yellow-500 px-2 py-0.5 font-semibold text-yellow-900">
                                                            On Hold
                                                        </span>
                                                        : Signifies the user has completed an action and is now awaiting administrator approval or review
                                                        to proceed.
                                                    </li>
                                                    <li>
                                                        <span className="rounded-md bg-green-600 px-2 py-0.5 font-semibold text-green-100">Done</span>: Confirms the user has successfully completed all assigned stages in the process.
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Created:</strong> The date and time the user's account
                                                was initially created.
                                            </li>
                                            <li className="space-y-2">
                                                <strong className="mb-1 block text-[#0a0a0a] dark:text-[#E6E6E6]">Buttons (Actions):</strong>
                                                <span className="text-[#0a0a0a] dark:text-[#E6E6E6]">A set of actions available for each user:</span>
                                                <ul className="mt-2 list-inside list-disc space-y-1 pl-8 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                                    <li>
                                                        <strong>Move to Next Stage:</strong> Advances the user to the immediately following stage in the
                                                        defined sequence.
                                                    </li>
                                                    <li>
                                                        <strong>Move to Any Stage:</strong> Opens a dialog allowing you to select and move the user to any
                                                        specific stage, irrespective of sequence.
                                                    </li>
                                                    <li>
                                                        <strong>Edit User:</strong> Displays a form to modify the user's profile information.
                                                    </li>
                                                    <li>
                                                        <strong>Delete User:</strong> Permanently removes the user and their associated data from the
                                                        system.
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </section>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="stages" className="mt-4">
                        <ScrollArea ref={scrollAreaRefs.stages} className="h-[calc(80vh-150px)] pr-6">
                            <div className="flex flex-col rounded-lg bg-white dark:bg-[#121212] p-6 border border-[#3E3E3A]">
                                <div className="mb-6 flex items-center justify-between border-b border-[#3E3E3A] pb-4">
                                    <h2 className="text-3xl font-bold text-[#0a0a0a] dark:text-[#E6E6E6]">Stages Documentation</h2>
                                </div>
                                <div className="space-y-8 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                    <section>
                                        <h3 className="mb-3 text-2xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">Stages Management</h3>
                                        <p className="leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            This section outlines the functionality for managing stages within the application.
                                        </p>
                                    </section>
                                    <section>
                                        <h4 className="mb-3 text-xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">(Add Stage) Button</h4>
                                        <p className="border-l-2 border-[#3E3E3A] pl-4 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            Allows you to add a stage. When clicked, it moves you to the stage creation page. In it you have:
                                        </p>
                                        <ul className="mt-2 list-inside list-disc space-y-3 pl-8 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Order:</strong> Enter the order of the stage (required).</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Name:</strong> The name of the stage, shown in the dashboard stage column and welcome page stepper (required).</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Title:</strong> The title of the stage, shown in the content card (required).</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Subtitle:</strong> The subtitle of the stage, shown in the content card (optional).</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Description:</strong> The description of the stage, shown in the content card. Supports rich text styling (bold, italic, etc.) (optional).</li>
                                            <li className="space-y-2">
                                                <strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Buttons:</strong> Action buttons for the stage, shown in the content card (optional). Click "Add button" to configure:
                                                <ul className="mt-2 list-inside list-disc space-y-1 pl-8 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                                    <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Button Text:</strong> Text displayed on the button (required).</li>
                                                    <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Popup content:</strong> Content for the popup shown after button click (contact info, details). Supports rich text (optional).</li>
                                                    <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Status:</strong> Button status. Null allows immediate progression to the next stage. "on hold" requires admin approval.</li>
                                                </ul>
                                                <p className="text-gray-500 dark:text-gray-400 italic">You can add and remove multiple buttons.</p>
                                            </li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">Image:</strong> Image for the stage, shown in the image card (optional).</li>
                                        </ul>
                                        <p className="mt-2 border-l-2 border-[#3E3E3A] pl-4 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            After entering information, click "Create Stage" to save it.
                                        </p>
                                    </section>
                                    <section>
                                        <h4 className="mb-3 text-xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">Stage Information Table</h4>
                                        <p className="mb-2 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            After the "Add Stage" button, the user information table contains:
                                        </p>
                                        <ul className="list-inside list-disc space-y-3 pl-4 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            <li><strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Order:</strong> The order of the stage.</li>
                                            <li><strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Name:</strong> The name of the stage.</li>
                                            <li><strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Title:</strong> The title of the page.</li>
                                            <li><strong className="inline-block w-28 text-[#0a0a0a] dark:text-[#E6E6E6]">Created At:</strong> The date the stage was created.</li>
                                            <li className="space-y-2">
                                                <strong className="mb-1 block text-[#0a0a0a] dark:text-[#E6E6E6]">Buttons:</strong>
                                                <ul className="mt-2 list-inside list-disc space-y-1 pl-8 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                                    <li><strong>View Stage:</strong> Moves to the stage information page.</li>
                                                    <li><strong>Edit Stage:</strong> Moves to the stage editing page.</li>
                                                    <li><strong>Delete Stage:</strong> Deletes the stage.</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </section>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="theme" className="mt-4">
                        <ScrollArea ref={scrollAreaRefs.theme} className="h-[calc(80vh-150px)] pr-6">
                            <div className="flex flex-col rounded-lg bg-white dark:bg-[#121212] p-6 border border-[#3E3E3A]">
                                <div className="mb-6 flex items-center justify-between border-b border-[#3E3E3A] pb-4">
                                    <h2 className="text-3xl font-bold text-[#0a0a0a] dark:text-[#E6E6E6]">Theme Customization Documentation</h2>
                                </div>
                                <div className="space-y-8 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                    <section>
                                        <h3 className="mb-3 text-2xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">Theme Controls</h3>
                                        <p className="leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            The theme customization options allow you to personalize the appearance of the application.
                                        </p>
                                    </section>

                                    <section>
                                        <h4 className="mb-3 text-xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">Theme Toggle</h4>
                                        <p className="border-l-2 border-[#3E3E3A] pl-4 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            A theme toggle button allows you to switch between the dark and light themes for the entire application.
                                        </p>
                                    </section>

                                    <section>
                                        <h4 className="mb-3 text-xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">Color Pickers</h4>
                                        <p className="mb-2 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            The following color pickers are available to customize specific elements:
                                        </p>
                                        <ul className="list-inside list-disc space-y-3 pl-4 text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">welcome-background:</strong> Affects the background color of the welcome page and the background of the popup.</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">welcome-foreground:</strong> Affects the text color of the welcome page, including text in the logout button, stepper, title in the content card, description in the content card, content in the popup, and the status word.</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">welcome-secondary:</strong> Affects the color of the subtitle.</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">welcome-border:</strong> Affects the borders of the header buttons.</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">welcome-button:</strong> Affects the background colors of the buttons in the content card.</li>
                                            <li><strong className="text-[#0a0a0a] dark:text-[#E6E6E6]">welcome-button-text:</strong> Affects the text color on the buttons in the content card.</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h4 className="mb-3 text-xl font-semibold text-[#0a0a0a] dark:text-[#E6E6E6]">Live Demo & Saving</h4>
                                        <p className="border-l-2 border-[#3E3E3A] pl-4 leading-relaxed text-[#0a0a0a] dark:text-[#E6E6E6]">
                                            A small demo of the welcome page helps you understand where each color is affecting the UI in real-time.
                                            Once you have chosen your colors, click the "Save Theme" button. This saves your selected colors, and you will see the new colors reflected in both the demo and the actual welcome page.
                                        </p>
                                    </section>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
                
                <DialogFooter>
                    <Button 
                        onClick={onClose}
                        className="bg-[#0a0a0a] text-white hover:bg-[#3E3E3A] dark:bg-[#E6E6E6] dark:text-[#0a0a0a] dark:hover:bg-[#d1d1d1]"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}