const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', color: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' },
  { value: 'absent', label: 'Absent', color: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200' },
  { value: 'late', label: 'Late', color: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200' },
  { value: 'excused', label: 'Excused', color: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200' }
]

export default function StatusSelector({ value, onChange, layout = 'horizontal' }) {
  const containerClass = layout === 'horizontal'
    ? 'flex gap-2'
    : 'grid grid-cols-2 gap-2'

  return (
    <div className={containerClass}>
      {STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all border-2 ${
            value === option.value
              ? option.color + ' shadow-md'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
