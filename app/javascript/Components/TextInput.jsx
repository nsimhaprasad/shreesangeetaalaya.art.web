export default function TextInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  autoComplete = '',
}) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`input ${error ? 'input-error' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
