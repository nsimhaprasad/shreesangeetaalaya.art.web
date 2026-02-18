import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

// Import Tailwind CSS
import '../assets/stylesheets/application.tailwind.css'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
  progress: {
    color: '#4B5563',
    showSpinner: true,
  },
  title: (title) => title ? `${title} - Shree Sangeetha Aalaya LMS` : 'Shree Sangeetha Aalaya LMS',
})
