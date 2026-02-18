export default function TextAreaInput({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  rows = 4,
}) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`input resize-y ${error ? 'input-error' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
