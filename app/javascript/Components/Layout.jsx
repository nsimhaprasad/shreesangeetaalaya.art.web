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

          <main className="flex-1 min-h-[calc(100vh-4.2rem)] lg:ml-64 transition-all duration-300">
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
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const config = {
    success: {
      icon: (
        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'var(--app-success)',
    },
    error: {
      icon: (
        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'var(--app-danger)',
    },
    info: {
      icon: (
        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'var(--app-info)',
    },
    warning: {
      icon: (
        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'var(--app-warning)',
    },
  }

  const { icon, color } = config[type] || config.info

  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-4 py-3 animate-slide-up"
      style={{
        borderColor: `color-mix(in srgb, ${color} 30%, var(--app-border))`,
        background: `color-mix(in srgb, ${color} 10%, var(--app-surface))`,
      }}
    >
      <span style={{ color }}>{icon}</span>
      <p className="flex-1 text-sm font-medium" style={{ color: 'var(--app-text)' }}>{message}</p>
      <button
        onClick={() => setVisible(false)}
        className="rounded-lg p-1 transition-colors"
        style={{ color: 'var(--app-text-muted)' }}
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
