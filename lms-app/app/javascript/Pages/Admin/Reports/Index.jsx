import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index({ summary }) {
  const reportCards = [
    {
      title: 'Earnings Reports',
      description: 'View revenue breakdown, trends, and payment analytics',
      href: '/admin/reports/earnings',
      icon: '💰',
      color: 'bg-green-100 text-green-800',
      borderColor: 'border-green-200',
    },
    {
      title: 'Attendance Analytics',
      description: 'Track attendance patterns and identify trends',
      href: '/admin/reports/attendance',
      icon: '📊',
      color: 'bg-blue-100 text-blue-800',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Student Analytics',
      description: 'Monitor student growth, retention, and demographics',
      href: '/admin/reports/students',
      icon: '👥',
      color: 'bg-purple-100 text-purple-800',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Batch Performance',
      description: 'Analyze batch metrics and completion rates',
      href: '/admin/reports/batch_performance',
      icon: '📈',
      color: 'bg-orange-100 text-orange-800',
      borderColor: 'border-orange-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive insights into your LMS performance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {summary.total_students}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Batches
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {summary.active_batches}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💵</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      ₹{summary.total_revenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg Attendance
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {summary.average_attendance}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {reportCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`block bg-white overflow-hidden shadow rounded-lg border-2 ${card.borderColor} hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                    <span className="text-3xl">{card.icon}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {card.description}
                    </p>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Export All Reports
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Schedule Report
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Print Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
