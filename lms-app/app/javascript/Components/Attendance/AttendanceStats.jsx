export default function AttendanceStats({ stats }) {
  const {
    total_classes = 0,
    present = 0,
    absent = 0,
    late = 0,
    excused = 0,
    attendance_percentage = 0
  } = stats

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50'
    if (percentage >= 75) return 'text-blue-600 bg-blue-50'
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const statCards = [
    { label: 'Total Classes', value: total_classes, color: 'bg-gray-50 text-gray-900' },
    { label: 'Present', value: present, color: 'bg-green-50 text-green-600' },
    { label: 'Absent', value: absent, color: 'bg-red-50 text-red-600' },
    { label: 'Late', value: late, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Excused', value: excused, color: 'bg-blue-50 text-blue-600' },
    {
      label: 'Attendance Rate',
      value: `${attendance_percentage.toFixed(1)}%`,
      color: getPercentageColor(attendance_percentage)
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`rounded-lg shadow-md p-4 ${stat.color}`}
        >
          <h3 className="text-xs font-medium opacity-75 mb-1">{stat.label}</h3>
          <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
