/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app:     'var(--bg-app)',
        surface: 'var(--bg-surface)',
        sidebar: 'var(--bg-sidebar)',
        navbar:  'var(--bg-navbar)',
        primary:   'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted:     'var(--text-muted)',
        accent:    'var(--color-accent)',
        border: {
          DEFAULT: 'var(--border)',
          grid:    'var(--border-grid)',
        },
        /* event border colors */
        'ev-b-order-new':    'var(--event-border-order-new)',
        'ev-b-order-bill':   'var(--event-border-order-bill)',
        'ev-b-order-closed': 'var(--event-border-order-closed)',
        'ev-b-banquet':      'var(--event-border-banquet)',
        'ev-b-res-new':      'var(--event-border-res-new)',
        'ev-b-res-request':  'var(--event-border-res-request)',
        'ev-b-res-open':     'var(--event-border-res-open)',
        'ev-b-res-closed':   'var(--event-border-res-closed)',
        'ev-b-queue':        'var(--event-border-queue)',
        /* event bg colors */
        'ev-order-new':    'var(--event-bg-order-new)',
        'ev-order-bill':   'var(--event-bg-order-bill)',
        'ev-order-closed': 'var(--event-bg-order-closed)',
        'ev-banquet':      'var(--event-bg-banquet)',
        'ev-res-new':      'var(--event-bg-res-new)',
        'ev-res-request':  'var(--event-bg-res-request)',
        'ev-res-open':     'var(--event-bg-res-open)',
        'ev-res-closed':   'var(--event-bg-res-closed)',
        'ev-queue':        'var(--event-bg-queue)',
        /* status text */
        'st-order':   'var(--status-order)',
        'st-new':     'var(--status-new)',
        'st-request': 'var(--status-request)',
        'st-open':    'var(--status-open)',
        'st-closed':  'var(--status-closed)',
        'st-queue':   'var(--status-queue)',
        'st-banquet': 'var(--status-banquet)',
      },
      boxShadow: {
        card:       'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
    },
  },
  plugins: [],
}

