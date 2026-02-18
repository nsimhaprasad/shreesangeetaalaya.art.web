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
      <div className="min-h-screen bg-gray-50">
        <Navbar
          user={auth?.user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex">
          <Sidebar
            user={auth?.user}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />

          <main className="flex-1 min-h-[calc(100vh-4rem)] lg:ml-64">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              {flash && Object.keys(flash).length > 0 && (
                <FlashMessages flash={flash} />
              )}
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
  
  if (flash.success) {
    messages.push({ type: 'success', message: flash.success })
  }
  if (flash.error) {
    messages.push({ type: 'error', message: flash.error })
  }
  if (flash.notice) {
    messages.push({ type: 'info', message: flash.notice })
  }
  if (flash.alert) {
    messages.push({ type: 'warning', message: flash.alert })
  }

  if (messages.length === 0) return null

  return (
    <div className="mb-6 space-y-2">
      {messages.map((msg, idx) => (
        <FlashMessage key={idx} type={msg.type} message={msg.message} />
      ))}
    </div>
  )
}

function FlashMessage({ type, message }) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800'
  }

  const icons = {
    success: (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${styles[type]} animate-slide-up`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
