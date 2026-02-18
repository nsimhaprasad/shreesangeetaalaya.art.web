import { Link, router } from '@inertiajs/react'

export default function Navbar({ user, sidebarOpen, setSidebarOpen }) {
  const handleLogout = (e) => {
    e.preventDefault()
    router.delete('/users/sign_out')
  }

  return (
    <nav className="bg-white shadow-lg fixed w-full z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="flex items-center ml-4 lg:ml-0">
              <span className="text-xl font-bold text-gray-800">
                Shree Sangeetha Aalaya LMS
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
