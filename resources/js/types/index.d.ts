import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    stage: number | string; // Updated to handle both number and string types for decimal values
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Stage {
    id: number;
    order: number;
    name: string;
    title: string;
    subtitle?: string;
    description?: string;
    button_linking?: string; // JSON string that needs to be parsed
    image?: string;
    created_at: string;
    updated_at: string;
}

export interface ButtonLink {
    text: string;
    popup: string;
    status: string;
}

export type StepKey = 'First step' | 'Second step' | 'Third step' | 'Fourth step' | 'Fifth step' | 'Sixth step' | 'Final step';
export type Status = 'not requested' | 'on hold' | 'done';
