import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { ToastProvider } from './UI'

export default function Layout({ children }) {
  const { auth, flash } = usePage().props
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar user={auth?.user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex">
          <Sidebar user={auth?.user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          <main className="flex-1 min-h-[calc(100vh-4.2rem)] lg:ml-64">
            <div className="app-page">
              {flash && Object.keys(flash).length > 0 && <FlashMessages flash={flash} />}
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}

function FlashMessages({ flash }) {
  if (!flash) return null

  const messages = []

  if (flash.success) messages.push({ type: 'success', message: flash.success })
  if (flash.error) messages.push({ type: 'error', message: flash.error })
  if (flash.notice) messages.push({ type: 'info', message: flash.notice })
  if (flash.alert) messages.push({ type: 'warning', message: flash.alert })

  if (messages.length === 0) return null

  return (
    <div className="mb-6 space-y-2">
      {messages.map((item, idx) => (
        <FlashMessage key={idx} type={item.type} message={item.message} />
      ))}
    </div>
  )
}

function FlashMessage({ type, message }) {
  const palette = {
    success: {
      borderColor: 'color-mix(in srgb, var(--app-success) 35%, var(--app-border))',
      background: 'color-mix(in srgb, var(--app-success) 14%, transparent)',
      color: 'var(--app-text)',
    },
    error: {
      borderColor: 'color-mix(in srgb, var(--app-danger) 35%, var(--app-border))',
      background: 'color-mix(in srgb, var(--app-danger) 14%, transparent)',
      color: 'var(--app-text)',
    },
    info: {
      borderColor: 'color-mix(in srgb, var(--app-info) 35%, var(--app-border))',
      background: 'color-mix(in srgb, var(--app-info) 14%, transparent)',
      color: 'var(--app-text)',
    },
    warning: {
      borderColor: 'color-mix(in srgb, var(--app-warning) 35%, var(--app-border))',
      background: 'color-mix(in srgb, var(--app-warning) 14%, transparent)',
      color: 'var(--app-text)',
    },
  }

  const icons = {
    success: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3 animate-slide-up" style={palette[type]}>
      {icons[type]}
      <p className="text-sm font-semibold">{message}</p>
    </div>
  )
}
