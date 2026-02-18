import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  { label, error, hint, icon, iconPosition = 'left', className = '', inputClassName = '', required = false, ...props },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          ref={ref}
          className={`
            input
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'input-error' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {hint && !error && (
        <p className="mt-1.5 text-sm" style={{ color: 'var(--app-text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  )
})

export const TextArea = forwardRef(function TextArea({ label, error, hint, rows = 4, className = '', required = false, ...props }, ref) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <textarea ref={ref} rows={rows} className={`input resize-y ${error ? 'input-error' : ''}`} {...props} />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {hint && !error && (
        <p className="mt-1.5 text-sm" style={{ color: 'var(--app-text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  )
})

export const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder = 'Select...', className = '', required = false, ...props },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`input appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23778695%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[right_12px_center] bg-no-repeat ${error ? 'input-error' : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {hint && !error && (
        <p className="mt-1.5 text-sm" style={{ color: 'var(--app-text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  )
})

export const Checkbox = forwardRef(function Checkbox({ label, error, className = '', ...props }, ref) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 ${className}`}>
      <input ref={ref} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" {...props} />
      {label && <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>{label}</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
})

export const Radio = forwardRef(function Radio({ label, className = '', ...props }, ref) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 ${className}`}>
      <input ref={ref} type="radio" className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500" {...props} />
      {label && <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>{label}</span>}
    </label>
  )
})

export const SearchInput = forwardRef(function SearchInput({ placeholder = 'Search...', className = '', onClear, ...props }, ref) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input ref={ref} type="search" placeholder={placeholder} className="input pl-10 pr-10" {...props} />
      {props.value && onClear && (
        <button type="button" onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
})

export default Input
