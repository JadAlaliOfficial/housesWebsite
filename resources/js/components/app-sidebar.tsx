import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { DocumentationPopup } from '@/components/DocumentationPopup';
import React, { useState } from 'react';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, HelpCircle } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const [isDocumentationPopupOpen, setIsDocumentationPopupOpen] = useState(false);

    const footerNavItems: NavItem[] = [
        {
            title: 'Documentation',
            icon: HelpCircle,
            action: () => setIsDocumentationPopupOpen(true)
        }
    ];

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Stages',
            href: '/stages',
            icon: Folder,
        },
        {
            title: 'Theme',
            href: '/admin/theme',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
            <DocumentationPopup isOpen={isDocumentationPopupOpen} onClose={() => setIsDocumentationPopupOpen(false)} />
        </Sidebar>
    );
}
