import '../css/app.css'
import React, { useEffect } from 'react'
import { createInertiaApp, usePage } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import { AppearanceProvider, useAppearance } from './hooks/appearance-context'

const appName = import.meta.env.VITE_APP_NAME || 'RoadMap'

function ThemeInjector({ children }: { children: React.ReactNode }) {
  const { theme } = usePage<{
    theme: {
      light: Record<string, string>
      dark: Record<string, string>
      appearance: 'light' | 'dark' | 'system'
    }
  }>().props

  const { appearance } = useAppearance()

  useEffect(() => {
    const light = theme.light || {}
    const dark = theme.dark || {}

    console.log('🛠 ThemeInjector → appearance =', appearance)

    document.documentElement.classList.remove('dark')

    Object.entries(light).forEach(([key, val]) => {
      document.documentElement.style.setProperty(`--color-${key}`, val)
    })

    const darkVars: Record<string, string> = {}
    Object.entries(dark).forEach(([key, val]) => {
      darkVars[`--color-${key}`] = val
    })

    const enableDark = () => {
      document.documentElement.classList.add('dark')
      Object.entries(darkVars).forEach(([k, v]) => {
        document.documentElement.style.setProperty(k, v)
      })
    }

    if (appearance === 'dark') {
      enableDark()
    } else if (
      appearance === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      enableDark()
    }

  }, [theme.light, theme.dark, appearance])

  return <>{children}</>
}

createInertiaApp({
  title: (title) => (title ? `${title} – ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx')
      ).then((module) => {
        const Page = (module as { default: React.ComponentType<any> }).default  // ✅ FIXED!
        return (props: any) => (
          <AppearanceProvider>
            <ThemeInjector>
              <Page {...props} />
            </ThemeInjector>
          </AppearanceProvider>
        )
      }),
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  },
  progress: {
    color: '#4B5563',
  },
})
