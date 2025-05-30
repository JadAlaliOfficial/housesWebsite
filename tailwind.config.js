/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './resources/js/**/*.tsx',
      './resources/js/**/*.jsx',
      './resources/views/**/*.blade.php',
      './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    ],
    darkMode: 'class',
    theme: {
      extend: {
        // map your CSS custom properties to Tailwind utilities
        colors: {
          background: 'var(--color-background)',
          foreground: 'var(--color-foreground)',
  
          card: 'var(--color-card)',
          'card-foreground': 'var(--color-card-foreground)',
  
          popover: 'var(--color-popover)',
          'popover-foreground': 'var(--color-popover-foreground)',
  
          primary: 'var(--color-primary)',
          'primary-foreground': 'var(--color-primary-foreground)',
  
          secondary: 'var(--color-secondary)',
          'secondary-foreground': 'var(--color-secondary-foreground)',
  
          muted: 'var(--color-muted)',
          'muted-foreground': 'var(--color-muted-foreground)',
  
          accent: 'var(--color-accent)',
          'accent-foreground': 'var(--color-accent-foreground)',
  
          destructive: 'var(--color-destructive)',
          'destructive-foreground': 'var(--color-destructive-foreground)',
  
          border: 'var(--color-border)',
          input: 'var(--color-input)',
          ring: 'var(--color-ring)',
  
          'chart-1': 'var(--color-chart-1)',
          'chart-2': 'var(--color-chart-2)',
          'chart-3': 'var(--color-chart-3)',
          'chart-4': 'var(--color-chart-4)',
          'chart-5': 'var(--color-chart-5)',
  
          sidebar: 'var(--color-sidebar)',
          'sidebar-foreground': 'var(--color-sidebar-foreground)',
          'sidebar-primary': 'var(--color-sidebar-primary)',
          'sidebar-primary-foreground': 'var(--color-sidebar-primary-foreground)',
          'sidebar-accent': 'var(--color-sidebar-accent)',
          'sidebar-accent-foreground': 'var(--color-sidebar-accent-foreground)',
          'sidebar-border': 'var(--color-sidebar-border)',
          'sidebar-ring': 'var(--color-sidebar-ring)',
        },
        borderRadius: {
          lg: 'var(--radius-lg)',
          md: 'var(--radius-md)',
          sm: 'var(--radius-sm)',
        },
        fontFamily: {
          sans: 'var(--font-sans)',
        },
      },
    },
    plugins: [
      require('tailwindcss-animate'),
    ],
  }
  