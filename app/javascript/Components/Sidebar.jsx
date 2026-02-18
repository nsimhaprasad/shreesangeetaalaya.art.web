import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'

const icons = {
  dashboard: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  students: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  batches: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  attendance: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  payments: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  resources: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  schedule: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  courses: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  reports: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  fees: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  gallery: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  teachers: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  profile: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  progress: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  classes: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  email: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  home: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  offers: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  sms: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  purchase: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-10 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
}

const navConfig = {
  admin: [
    { section: 'Overview', items: [
      { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' }
    ]},
    { section: 'Management', items: [
      { name: 'Students', href: '/admin/students', icon: 'students' },
      { name: 'Teachers', href: '/admin/teachers', icon: 'teachers' },
      { name: 'Courses', href: '/admin/courses', icon: 'courses' },
      { name: 'Batches', href: '/admin/batches', icon: 'batches' }
    ]},
    { section: 'Finance', items: [
      { name: 'Payments', href: '/admin/payments', icon: 'payments' },
      { name: 'Fee Structures', href: '/admin/fee_structures', icon: 'fees' },
      { name: 'Fee Offers', href: '/admin/fee_offers', icon: 'offers' }
    ]},
    { section: 'Academic', items: [
      { name: 'Attendance', href: '/admin/attendances', icon: 'attendance' },
      { name: 'Resources', href: '/admin/learning_resources', icon: 'resources' },
      { name: 'Class Sessions', href: '/admin/class_sessions', icon: 'classes' }
    ]},
    { section: 'Reports', items: [
      { name: 'Reports', href: '/admin/reports', icon: 'reports' }
    ]},
    { section: 'Settings', items: [
      { name: 'Gallery', href: '/admin/gallery', icon: 'gallery' },
      { name: 'Email Templates', href: '/admin/email_templates', icon: 'email' },
      { name: 'SMS Templates', href: '/admin/sms_templates', icon: 'sms' }
    ]}
  ],
  teacher: [
    { section: 'Overview', items: [
      { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' }
    ]},
    { section: 'Students', items: [
      { name: 'All Students', href: '/teacher/students', icon: 'students' },
      { name: 'My Batches', href: '/teacher/batches', icon: 'batches' }
    ]},
    { section: 'Classes', items: [
      { name: 'Schedule', href: '/teacher/class_sessions', icon: 'classes' },
      { name: 'Attendance', href: '/teacher/attendances', icon: 'attendance' }
    ]},
    { section: 'Resources', items: [
      { name: 'Learning Materials', href: '/teacher/learning_resources', icon: 'resources' }
    ]},
    { section: 'Finance', items: [
      { name: 'Payments', href: '/teacher/payments', icon: 'payments' },
      { name: 'Fee Structure', href: '/teacher/fee_structures', icon: 'fees' }
    ]},
    { section: 'Other', items: [
      { name: 'Reports', href: '/teacher/reports', icon: 'reports' },
      { name: 'Gallery', href: '/teacher/gallery', icon: 'gallery' }
    ]}
  ],
  student: [
    { section: 'Overview', items: [
      { name: 'Dashboard', href: '/student/dashboard', icon: 'dashboard' }
    ]},
    { section: 'Learning', items: [
      { name: 'My Courses', href: '/student/courses', icon: 'courses' },
      { name: 'My Batches', href: '/student/batches', icon: 'batches' },
      { name: 'Schedule', href: '/student/schedule', icon: 'schedule' },
      { name: 'Resources', href: '/student/learning_resources', icon: 'resources' }
    ]},
    { section: 'Tracking', items: [
      { name: 'Attendance', href: '/student/attendances', icon: 'attendance' },
      { name: 'Progress', href: '/student/progress', icon: 'progress' }
    ]},
    { section: 'Finance', items: [
      { name: 'Payments', href: '/student/payments', icon: 'payments' },
      { name: 'Purchase Credits', href: '/student/purchases', icon: 'purchase' }
    ]},
    { section: 'Other', items: [
      { name: 'Profile', href: '/student/profile', icon: 'profile' },
      { name: 'Gallery', href: '/student/gallery', icon: 'gallery' }
    ]}
  ]
}

export default function Sidebar({ user, isOpen, setIsOpen }) {
  const { url } = usePage()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null

  const navSections = navConfig[user.role] || []

  const isActive = (href) => url === href || url.startsWith(href + '/')

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'var(--app-overlay)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          app-sidebar fixed left-0 z-30 h-[calc(100vh-4.2rem)] border-r transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 ${collapsed ? 'lg:w-[68px]' : 'lg:w-64'}
          w-64
        `}
        style={{ top: '4.2rem' }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Nav items */}
          <div className="flex-1 overflow-y-auto py-3 scrollbar-hide">
            {navSections.map((section, idx) => (
              <div key={idx} className="mb-3">
                {!collapsed && section.section && (
                  <h3
                    className="mb-1 px-4 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--app-text-soft)' }}
                  >
                    {section.section}
                  </h3>
                )}
                <nav className="px-2 space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        title={collapsed ? item.name : undefined}
                        className="flex items-center gap-3 rounded-xl transition-all duration-150"
                        style={{
                          padding: collapsed ? '0.625rem' : '0.5rem 0.75rem',
                          justifyContent: collapsed ? 'center' : 'flex-start',
                          color: active ? 'var(--app-brand)' : 'var(--app-text-muted)',
                          background: active
                            ? 'var(--app-brand-soft)'
                            : 'transparent',
                          border: active
                            ? `1px solid color-mix(in srgb, var(--app-brand) 30%, transparent)`
                            : '1px solid transparent',
                          fontWeight: active ? '600' : '500',
                          fontSize: '13.5px',
                        }}
                      >
                        <span
                          style={{
                            color: active ? 'var(--app-brand)' : 'var(--app-text-soft)',
                            flexShrink: 0,
                          }}
                        >
                          {icons[item.icon]}
                        </span>
                        {!collapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Collapse toggle (desktop only) */}
          <div className="hidden border-t py-3 px-2 lg:block" style={{ borderColor: 'var(--app-border)' }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center p-2 rounded-xl transition-all duration-150"
              style={{ color: 'var(--app-text-soft)' }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span style={{ transition: 'transform 0.3s ease', display: 'block' }}>
                {collapsed ? icons.chevronRight : icons.chevronLeft}
              </span>
              {!collapsed && (
                <span className="ml-2 text-xs" style={{ color: 'var(--app-text-soft)' }}>Collapse</span>
              )}
            </button>
          </div>

          {/* Back to website */}
          {!collapsed && (
            <div className="border-t px-3 py-3" style={{ borderColor: 'var(--app-border)' }}>
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-all duration-150"
                style={{ color: 'var(--app-text-muted)' }}
              >
                {icons.home}
                <span>Back to Website</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
