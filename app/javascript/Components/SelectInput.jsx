export default function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
}) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
