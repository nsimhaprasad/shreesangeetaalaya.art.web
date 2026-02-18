import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const { auth, flash } = usePage().props
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        user={auth.user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex">
        <Sidebar
          user={auth.user}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className="flex-1 p-6 lg:ml-64">
          {/* Flash Messages */}
          {flash && (
            <div className="mb-4 space-y-2">
              {flash.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  {flash.success}
                </div>
              )}
              {flash.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {flash.error}
                </div>
              )}
              {flash.notice && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
                  {flash.notice}
                </div>
              )}
              {flash.alert && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                  {flash.alert}
                </div>
              )}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
