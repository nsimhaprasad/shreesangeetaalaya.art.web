const STATUS_COLORS = {
  present: 'bg-green-100 text-green-800 border-green-300',
  absent: 'bg-red-100 text-red-800 border-red-300',
  late: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  excused: 'bg-blue-100 text-blue-800 border-blue-300',
  not_marked: 'bg-gray-100 text-gray-600 border-gray-300'
}

const STATUS_LABELS = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
  not_marked: 'Not Marked'
}

export default function StatusBadge({ status, showIcon = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const icons = {
    present: '✓',
    absent: '✗',
    late: '⏰',
    excused: 'ℹ',
    not_marked: '—'
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${
        STATUS_COLORS[status] || STATUS_COLORS.not_marked
      } ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showIcon && <span>{icons[status]}</span>}
      {STATUS_LABELS[status] || 'Unknown'}
    </span>
  )
}
