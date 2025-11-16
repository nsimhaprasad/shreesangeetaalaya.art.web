export default function FileInput({
  label,
  name,
  onChange,
  error,
  required = false,
  accept = '',
  disabled = false,
  helpText = ''
}) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="file"
        onChange={onChange}
        required={required}
        accept={accept}
        disabled={disabled}
        className={`appearance-none block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
