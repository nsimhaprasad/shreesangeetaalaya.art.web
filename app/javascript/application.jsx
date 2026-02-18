import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
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
    color: '#ed7612',
    showSpinner: true,
  },
  title: (title) => title 
    ? `${title} | Shree Sangeetha Aalaya` 
    : 'Shree Sangeetha Aalaya - Carnatic Music Institution',
})
