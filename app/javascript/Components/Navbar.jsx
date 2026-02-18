import { useEffect, useRef, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { Avatar } from './UI'
import useTheme from '@/hooks/useTheme'

const icons = {
  menu: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  bell: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  logout: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  user: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  chevronDown: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  sun: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0L16.95 7.05M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  moon: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646a9 9 0 1011.708 11.708z" />
    </svg>
  ),
  home: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
}

const roleProfileHref = (role) => {
  if (role === 'student') return '/student/profile'
  if (role === 'teacher') return '/teacher/students'
  return '/dashboard'
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
    const roles = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' }
    return roles[user?.role] || user?.role || 'Member'
  }

  const getRoleBadgeStyle = () => {
    const styles = {
      admin: { background: 'color-mix(in srgb, var(--app-danger) 15%, transparent)', color: 'var(--app-danger)' },
      teacher: { background: 'color-mix(in srgb, var(--app-brand) 15%, transparent)', color: 'var(--app-brand)' },
      student: { background: 'color-mix(in srgb, var(--app-info) 15%, transparent)', color: 'var(--app-info)' },
    }
    return styles[user?.role] || { background: 'color-mix(in srgb, var(--app-text-muted) 15%, transparent)', color: 'var(--app-text-muted)' }
  }

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <div className="flex h-[4.2rem] items-center justify-between gap-4">
          {/* Left: hamburger + brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200"
              style={{
                border: '1px solid var(--app-border)',
                color: 'var(--app-text-muted)',
                background: 'transparent'
              }}
              aria-label="Toggle sidebar menu"
            >
              {icons.menu}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-glow flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, var(--app-brand), var(--app-brand-strong))' }}
              >
                <span className="text-base font-bold font-display">श</span>
              </div>
              <div className="hidden sm:block leading-tight">
                <h1 className="text-[15px] font-display font-semibold" style={{ color: 'var(--app-text)' }}>
                  Shree Sangeetha Aalaya
                </h1>
                <p className="text-[11px]" style={{ color: 'var(--app-text-soft)' }}>Music Learning Platform</p>
              </div>
            </Link>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200"
              style={{
                border: '1px solid var(--app-border)',
                color: 'var(--app-text-muted)',
                background: 'transparent'
              }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? icons.sun : icons.moon}
            </button>

            {/* Notification bell */}
            <button
              className="relative flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200"
              style={{
                border: '1px solid var(--app-border)',
                color: 'var(--app-text-muted)',
                background: 'transparent'
              }}
              aria-label="Notifications"
            >
              {icons.bell}
            </button>

            {/* User dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200"
                  style={{
                    border: `1px solid ${dropdownOpen ? 'var(--app-border-strong)' : 'var(--app-border)'}`,
                    background: dropdownOpen ? 'color-mix(in srgb, var(--app-surface-soft) 80%, transparent)' : 'transparent'
                  }}
                >
                  <Avatar name={getUserDisplayName()} size="sm" />
                  <div className="hidden md:block text-left">
                    <p className="text-[13px] font-semibold leading-tight" style={{ color: 'var(--app-text)' }}>
                      {getUserDisplayName()}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--app-text-soft)' }}>
                      {getUserRoleLabel()}
                    </p>
                  </div>
                  <span
                    style={{
                      color: 'var(--app-text-soft)',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {icons.chevronDown}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl border py-1 z-50 animate-scale-in"
                    style={{
                      background: 'var(--app-surface)',
                      borderColor: 'var(--app-border)',
                      boxShadow: 'var(--shadow-elevated)'
                    }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--app-border)' }}>
                      <div className="flex items-center gap-3">
                        <Avatar name={getUserDisplayName()} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--app-text)' }}>
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs truncate" style={{ color: 'var(--app-text-muted)' }}>
                            {user.email}
                          </p>
                          <span
                            className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={getRoleBadgeStyle()}
                          >
                            {getUserRoleLabel()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href={roleProfileHref(user.role)}
                        className="dropdown-item flex items-center gap-3"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {icons.user}
                        <span>My Profile</span>
                      </Link>

                      <button
                        type="button"
                        className="dropdown-item flex w-full items-center gap-3 text-left"
                        onClick={() => { toggleTheme(); setDropdownOpen(false) }}
                      >
                        {theme === 'dark' ? icons.sun : icons.moon}
                        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                      </button>

                      <Link
                        href="/"
                        className="dropdown-item flex items-center gap-3"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {icons.home}
                        <span>Back to Website</span>
                      </Link>
                    </div>

                    <div className="border-t py-1" style={{ borderColor: 'var(--app-border)' }}>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item flex w-full items-center gap-3 text-left"
                        style={{ color: 'var(--app-danger)' }}
                      >
                        {icons.logout}
                        <span>Sign out</span>
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
