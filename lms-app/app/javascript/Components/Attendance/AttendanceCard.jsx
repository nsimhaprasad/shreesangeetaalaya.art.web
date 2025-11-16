import StatusBadge from './StatusBadge'

export default function AttendanceCard({ attendance, showNotes = true, showTime = true }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const date = new Date(timeString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors bg-white">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">
            {formatDate(attendance.date)}
          </h3>
          {showTime && attendance.class_time && (
            <p className="text-sm text-gray-600">{formatTime(attendance.class_time)}</p>
          )}
        </div>
        <StatusBadge status={attendance.status} showIcon />
      </div>

      {attendance.batch_name && (
        <div className="text-sm text-gray-600 mb-1">
          <strong>Batch:</strong> {attendance.batch_name}
        </div>
      )}

      {attendance.course_name && (
        <div className="text-sm text-gray-600 mb-1">
          <strong>Course:</strong> {attendance.course_name}
        </div>
      )}

      {showNotes && attendance.notes && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Notes:</strong> {attendance.notes}
          </p>
        </div>
      )}

      {attendance.marked_at && (
        <div className="mt-2 text-xs text-gray-500">
          Marked: {formatTime(attendance.marked_at)}
        </div>
      )}
    </div>
  )
}
