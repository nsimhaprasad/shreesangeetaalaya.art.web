import { forwardRef } from 'react'

const Button = forwardRef(function Button({ 
  children, 
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props 
}, ref) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
    link: 'btn text-primary-600 hover:text-primary-700 hover:bg-primary-50'
  }

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    icon: 'p-2.5'
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  )
})

export const IconButton = forwardRef(function IconButton({ 
  icon, 
  variant = 'ghost', 
  size = 'md', 
  className = '',
  'aria-label': ariaLabel,
  ...props 
}, ref) {
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  }

  const variants = {
    ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
    primary: 'bg-primary-100 text-primary-600 hover:bg-primary-200',
    danger: 'text-red-500 hover:text-red-700 hover:bg-red-50'
  }

  return (
    <button
      ref={ref}
      className={`rounded-lg transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  )
})

export const ButtonGroup = ({ children, className = '' }) => (
  <div className={`flex -space-x-px ${className}`}>
    {children}
  </div>
)

export default Button
