import { Link, usePage } from '@inertiajs/react'

export default function Sidebar({ user, isOpen, setIsOpen }) {
  const { url } = usePage()

  if (!user) return null

  const isActive = (path) => {
    return url.startsWith(path) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }

  const getNavItems = () => {
    const role = user.role

    if (role === 'admin') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Students', href: '/admin/students', icon: '👨‍🎓' },
        { name: 'Teachers', href: '/admin/teachers', icon: '👨‍🏫' },
        { name: 'Courses', href: '/admin/courses', icon: '📚' },
        { name: 'Batches', href: '/admin/batches', icon: '👥' },
        { name: 'Payments', href: '/admin/payments', icon: '💰' },
        { name: 'Attendance', href: '/admin/attendances', icon: '📋' },
        { name: 'Resources', href: '/admin/learning_resources', icon: '📖' },
      ]
    } else if (role === 'teacher') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'My Students', href: '/teacher/students', icon: '👨‍🎓' },
        { name: 'My Batches', href: '/teacher/batches', icon: '👥' },
        { name: 'Attendance', href: '/teacher/attendances', icon: '📋' },
        { name: 'Resources', href: '/teacher/learning_resources', icon: '📖' },
      ]
    } else if (role === 'student') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'My Courses', href: '/student/courses', icon: '📚' },
        { name: 'My Batches', href: '/student/batches', icon: '👥' },
        { name: 'Attendance', href: '/student/attendances', icon: '📋' },
        { name: 'Resources', href: '/student/learning_resources', icon: '📖' },
        { name: 'Payments', href: '/student/payments', icon: '💰' },
      ]
    }

    return []
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 bg-gray-800 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${isActive(item.href)} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}
