export default function DateInput({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  min,
  max,
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
        type="date"
        value={value || ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={`input ${error ? 'input-error' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
