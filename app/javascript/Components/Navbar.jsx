import { useEffect, useRef, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { Avatar, IconButton } from './UI'
import useTheme from '@/hooks/useTheme'

const icons = {
  menu: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  bell: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  logout: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  settings: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  user: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  chevronDown: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  sun: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0L16.95 7.05M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  moon: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646a9 9 0 1011.708 11.708z" />
    </svg>
  ),
}

export default function Navbar({ user, sidebarOpen, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { theme, toggleTheme } = useTheme()

  const handleLogout = (event) => {
    event.preventDefault()
    router.delete('/users/sign_out')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`
    return user?.email?.split('@')[0] || 'User'
  }

  const getUserRoleLabel = () => {
    const roles = {
      admin: 'Administrator',
      teacher: 'Teacher',
      student: 'Student',
    }

    return roles[user?.role] || user?.role || 'Member'
  }

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <div className="flex h-[4.2rem] items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden rounded-xl border p-2 transition-colors hover:bg-gray-100"
              style={{ borderColor: 'var(--app-border)', color: 'var(--app-text-muted)' }}
              aria-label="Toggle sidebar menu"
            >
              {icons.menu}
            </button>

            <Link href="/" className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-glow">
                  <span className="text-lg font-bold">श</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-display font-semibold leading-tight">Shree Sangeetha Aalaya</h1>
                  <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>Learning platform</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="btn-secondary btn-icon"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? icons.sun : icons.moon}
            </button>

            <IconButton icon={icons.bell} variant="ghost" aria-label="Notifications" className="relative" />

            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-gray-100"
                >
                  <Avatar name={getUserDisplayName()} size="sm" />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>{getUserDisplayName()}</p>
                    <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>{getUserRoleLabel()}</p>
                  </div>
                  <span style={{ color: 'var(--app-text-muted)' }}>{icons.chevronDown}</span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown">
                    <div className="border-b px-4 py-3" style={{ borderColor: 'var(--app-border)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>{getUserDisplayName()}</p>
                      <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>{user.email}</p>
                    </div>

                    <Link
                      href={user.role === 'student' ? '/student/profile' : '/dashboard'}
                      className="dropdown-item flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {icons.user}
                      Profile
                    </Link>

                    <button
                      type="button"
                      className="dropdown-item flex w-full items-center gap-2 text-left"
                      onClick={() => {
                        toggleTheme()
                        setDropdownOpen(false)
                      }}
                    >
                      {theme === 'dark' ? icons.sun : icons.moon}
                      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    </button>

                    <Link href="#" className="dropdown-item flex items-center gap-2" onClick={() => setDropdownOpen(false)}>
                      {icons.settings}
                      Settings
                    </Link>

                    <div className="mt-1 border-t pt-1" style={{ borderColor: 'var(--app-border)' }}>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item flex w-full items-center gap-2 text-left text-rose-500 hover:bg-rose-500/10"
                      >
                        {icons.logout}
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
