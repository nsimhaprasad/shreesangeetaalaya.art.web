export default function ProgressBar({ percentage, showLabel = true, height = 'h-4' }) {
  const getBarColor = (percent) => {
    if (percent >= 90) return 'bg-green-500'
    if (percent >= 75) return 'bg-blue-500'
    if (percent >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTextColor = (percent) => {
    if (percent >= 90) return 'text-green-600'
    if (percent >= 75) return 'text-blue-600'
    if (percent >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const validPercentage = Math.min(100, Math.max(0, percentage || 0))

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Attendance Progress</span>
          <span className={`text-sm font-semibold ${getTextColor(validPercentage)}`}>
            {validPercentage.toFixed(1)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${getBarColor(validPercentage)}`}
          style={{ width: `${validPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}
