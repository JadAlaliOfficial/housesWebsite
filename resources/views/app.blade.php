<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  {{-- Fallback background --}}
  <style>
    html { background-color: var(--color-background); }
    html.dark { background-color: var(--color-background); }
  </style>


  {{-- Fonts --}}
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Alumni+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet">

  {{-- Vite --}}
  @routes
  @viteReactRefresh
  @vite([
    'resources/css/app.css',
    'resources/js/app.tsx',
  ])
  @inertiaHead
</head>
<body class="font-sans antialiased">
  @inertia
</body>
</html>
