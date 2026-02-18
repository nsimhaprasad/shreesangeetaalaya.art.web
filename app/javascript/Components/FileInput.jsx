export default function FileInput({
  label,
  name,
  onChange,
  error,
  required = false,
  accept = '',
  disabled = false,
  helpText = '',
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
        type="file"
        onChange={onChange}
        required={required}
        accept={accept}
        disabled={disabled}
        className={`input file:mr-4 file:rounded-lg file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 ${error ? 'input-error' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      />
      {helpText && <p className="mt-1 text-sm" style={{ color: 'var(--app-text-muted)' }}>{helpText}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
