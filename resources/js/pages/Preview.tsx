import React from 'react'
import { Head } from '@inertiajs/react'

interface ColorItem {
  name: string
  bgClass: string
  textClass?: string
  extraClass?: string
}

export default function Preview() {
  const items: ColorItem[] = [
    { name: 'Background / Foreground', bgClass: 'bg-background', textClass: 'text-foreground' },
    { name: 'Card', bgClass: 'bg-card', textClass: 'text-card-foreground' },
    { name: 'Popover', bgClass: 'bg-popover', textClass: 'text-popover-foreground' },
    { name: 'Primary', bgClass: 'bg-primary', textClass: 'text-primary-foreground' },
    { name: 'Secondary', bgClass: 'bg-secondary', textClass: 'text-secondary-foreground' },
    { name: 'Muted', bgClass: 'bg-muted', textClass: 'text-muted-foreground' },
    { name: 'Accent', bgClass: 'bg-accent', textClass: 'text-accent-foreground' },
    { name: 'Destructive', bgClass: 'bg-destructive', textClass: 'text-destructive-foreground' },
    { name: 'Border', bgClass: 'bg-background', textClass: 'text-foreground', extraClass: 'border border-border' },
    { name: 'Input', bgClass: 'bg-input', textClass: 'text-foreground', extraClass: 'p-2 rounded border border-input' },
    { name: 'Ring', bgClass: 'bg-background', textClass: 'text-foreground', extraClass: 'p-4 ring-2 ring-ring rounded' },
    { name: 'Chart 1', bgClass: 'bg-chart-1' },
    { name: 'Chart 2', bgClass: 'bg-chart-2' },
    { name: 'Chart 3', bgClass: 'bg-chart-3' },
    { name: 'Chart 4', bgClass: 'bg-chart-4' },
    { name: 'Chart 5', bgClass: 'bg-chart-5' },
    { name: 'Sidebar', bgClass: 'bg-sidebar', textClass: 'text-sidebar-foreground' },
    { name: 'Sidebar Primary', bgClass: 'bg-sidebar-primary', textClass: 'text-sidebar-primary-foreground' },
    { name: 'Sidebar Accent', bgClass: 'bg-sidebar-accent', textClass: 'text-sidebar-accent-foreground' },
    { name: 'Sidebar Border', bgClass: 'bg-background', extraClass: 'border border-sidebar-border' },
    { name: 'Sidebar Ring', bgClass: 'bg-background', extraClass: 'p-4 ring-2 ring-sidebar-ring rounded' },
  ]

  return (
    <>
      <Head title="Tailwind Theme Preview" />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theme Preview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ name, bgClass, textClass = 'text-foreground', extraClass = '' }) => (
            <div
              key={name}
              className={`h-24 flex items-center justify-center rounded-lg shadow ${bgClass} ${textClass} ${extraClass}`}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
