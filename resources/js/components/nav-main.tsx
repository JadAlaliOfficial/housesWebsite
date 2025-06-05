import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button'; // Assuming Button is a suitable component for actions

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.action ? (
                            <SidebarMenuButton
                                onClick={item.action}
                                tooltip={{ children: item.title }}
                                isActive={item.isActive} // We might need a way to determine active state for actions
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        ) : (
                            <SidebarMenuButton  
                                asChild isActive={item.href ? item.href === page.url : false}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href || ''} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
