import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type BreadcrumbItem } from '@/types'

type Theme = Record<string, string>

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Theme Customizer', href:'#' },
]

export default function ThemeCustomizer() {
  // pull in the shared theme props
  const {
    theme: { light, dark },
  } = usePage<{ theme: { light: Theme; dark: Theme } }>().props

  const [lightState, setLight] = useState<Theme>(light)
  const [darkState, setDark] = useState<Theme>(dark)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.post(route('admin.theme'), { light: lightState, dark: darkState })
  }

  const renderInputs = (obj: Theme, setter: (v: Theme) => void) =>
    Object.entries(obj).map(([key, val]) => (
      <div key={key} className="mb-4">
        <label className="block mb-1 text-sm font-medium">{key}</label>
        <input
          type="color"
          value={val}
          onChange={(e) =>
            setter({ ...obj, [key]: e.target.value })
          }
          className="h-10 w-10 p-0 border rounded"
        />
      </div>
    ))

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Theme Customizer" />

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Theme Customizer</CardTitle>
            <CardDescription>
              Set your light and dark palette
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-4">Light Theme</h2>
              <div className="grid grid-cols-4 gap-4">
                {renderInputs(lightState, setLight)}
              </div>
              <div>
                here 
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">Dark Theme</h2>
              <div className="grid grid-cols-2 gap-4">
                {renderInputs(darkState, setDark)}
              </div>
            </section>

            <Button type="submit" className="mt-4">
              Save Theme
            </Button>

           
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
