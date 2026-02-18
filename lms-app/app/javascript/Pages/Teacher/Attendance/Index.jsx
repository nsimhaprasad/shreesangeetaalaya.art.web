import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, Button, Badge, StatusBadge, StatCard, EmptyState } from '@components/UI'

export default function AttendanceIndex({ batches = [], stats = {} }) {
  const quickActions = [
    { 
      title: 'Mark Attendance', 
      description: 'Record today\'s attendance',
      href: '/teacher/attendances/mark_attendance',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'bg-primary-50 text-primary-600'
    },
    { 
      title: 'Calendar View', 
      description: 'Visual attendance heatmap',
      href: '/teacher/attendances/calendar',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-green-50 text-green-600'
    },
    { 
      title: 'Reports', 
      description: 'Generate attendance reports',
      href: '/teacher/attendances/report',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      title: 'Class Sessions', 
      description: 'Manage class sessions',
      href: '/teacher/class_sessions',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-amber-50 text-amber-600'
    }
  ]

  return (
    <Layout>
      <Head title="Attendance" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-500 text-sm">Track and manage student attendance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Present Today" value={stats?.present_today || 0} />
          <StatCard title="Absent Today" value={stats?.absent_today || 0} />
          <StatCard title="Avg Attendance" value={`${stats?.avg_percentage || 0}%`} />
          <StatCard title="Low Attendance" value={stats?.low_attendance || 0} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} href={action.href}>
              <Card hover className="text-center h-full">
                <div className={`w-16 h-16 mx-auto rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Batches</h2>
          {batches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <div key={batch.id} className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                  <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                  <p className="text-sm text-gray-500">{batch.course_name}</p>
                  <p className="text-sm text-gray-400 mt-2">{batch.student_count} students</p>
                  <div className="mt-4 flex gap-2">
                    <Link 
                      href={`/teacher/attendances/mark_attendance?batch_id=${batch.id}`}
                      className="btn-primary flex-1 text-sm py-2"
                    >
                      Mark
                    </Link>
                    <Link 
                      href={`/teacher/attendances/report?batch_id=${batch.id}`}
                      className="btn-secondary flex-1 text-sm py-2"
                    >
                      Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No batches assigned" description="Create batches to start tracking attendance" />
          )}
        </Card>
      </div>
    </Layout>
  )
}
