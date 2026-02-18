import React from 'react';
import { Link } from '@inertiajs/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function Students({
  active_students,
  enrollment_trends,
  course_popularity,
  student_growth,
  retention_rate,
  demographics,
}) {
  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = 'Month,Enrollments\n';
    enrollment_trends.forEach((row) => {
      csv += `${row.month},${row.enrollments}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_analytics_report.csv';
    a.click();
  };

  const statusData = [
    { name: 'Active', value: active_students.active, color: '#10b981' },
    { name: 'Inactive', value: active_students.inactive, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link href="/admin/reports" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Back to Reports
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Student Analytics</h1>
            <p className="mt-2 text-sm text-gray-600">
              Comprehensive student enrollment and engagement insights
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Export PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {active_students.total}
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
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Students
                    </dt>
                    <dd className="text-2xl font-bold text-green-600">
                      {active_students.active}
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
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Growth Rate
                    </dt>
                    <dd className={`text-2xl font-bold ${student_growth.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {student_growth.growth_rate > 0 ? '+' : ''}{student_growth.growth_rate}%
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
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Retention Rate
                    </dt>
                    <dd className="text-2xl font-bold text-blue-600">
                      {retention_rate.retention_rate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Student Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Student Growth Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Current Month</span>
                <span className="text-xl font-bold text-gray-900">
                  {student_growth.current_month} new students
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Previous Month</span>
                <span className="text-xl font-bold text-gray-900">
                  {student_growth.previous_month} new students
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-600">Growth Rate</span>
                <span className={`text-2xl font-bold ${student_growth.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {student_growth.growth_rate > 0 ? '+' : ''}{student_growth.growth_rate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Trends */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            12-Month Enrollment Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={enrollment_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="enrollments"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="New Enrollments"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Popularity */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Course Popularity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={course_popularity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#8884d8" name="Total Students" />
              <Bar dataKey="batches" fill="#82ca9d" name="Batches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Details Table */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Course Enrollment Details
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Batches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Students/Batch
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {course_popularity.map((course, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.course_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.batches}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.avg_students_per_batch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Retention Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Student Retention Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-blue-600 mb-2">
                Eligible Students
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {retention_rate.total_eligible}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Students enrolled 3+ months ago
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-green-600 mb-2">
                Retained Students
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {retention_rate.retained}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Still actively enrolled
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-purple-600 mb-2">
                Retention Rate
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {retention_rate.retention_rate}%
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Overall retention percentage
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> Retention rate is calculated based on students who enrolled
              more than 3 months ago and are still actively enrolled in at least one batch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
