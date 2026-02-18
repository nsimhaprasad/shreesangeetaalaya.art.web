import { useState } from 'react'

export const Badge = ({ children, variant = 'default', size = 'md', dot = false, className = '' }) => {
  const variants = {
    default: '',
    primary: 'badge-primary',
    secondary: '',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    gold: 'badge-gold',
  }

  const inlineStyles = {
    default: { background: 'color-mix(in srgb, var(--app-text-muted) 12%, transparent)', color: 'var(--app-text-muted)' },
    secondary: { background: 'color-mix(in srgb, #6852a5 12%, transparent)', color: '#6852a5' },
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`badge ${variants[variant]} ${sizes[size]} ${className}`}
      style={inlineStyles[variant]}
    >
      {dot && (
        <span
          className="mr-1.5 h-1.5 w-1.5 rounded-full inline-block"
          style={{
            background: variant === 'success' ? 'var(--app-success)'
              : variant === 'warning' ? 'var(--app-warning)'
                : variant === 'danger' ? 'var(--app-danger)'
                  : variant === 'info' ? 'var(--app-info)'
                    : 'var(--app-text-muted)'
          }}
        />
      )}
      {children}
    </span>
  )
}

export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    draft: { variant: 'default', label: 'Draft' },
    published: { variant: 'success', label: 'Published' },
    enrolled: { variant: 'primary', label: 'Enrolled' },
    graduated: { variant: 'info', label: 'Graduated' },
  }

  const config = statusConfig[status] || { variant: 'default', label: status }

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  )
}

export const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'avatar-sm',
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  }

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return <img src={src} alt={name} className={`avatar ${sizes[size]} object-cover ${className}`} />
  }

  return <div className={`avatar ${sizes[size]} ${className}`}>{initials || '?'}</div>
}

export const AvatarGroup = ({ avatars = [], max = 4, size = 'md' }) => {
  const visible = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, i) => (
        <Avatar key={i} {...avatar} size={size} className="ring-2 ring-white/70" />
      ))}
      {remaining > 0 && (
        <div className={`avatar ${size === 'md' ? 'avatar-md' : 'avatar-sm'} ring-2`} style={{ background: 'var(--app-surface-soft)', color: 'var(--app-text-muted)' }}>+{remaining}</div>
      )}
    </div>
  )
}

export const Progress = ({ value = 0, max = 100, size = 'md', color = 'primary', showLabel = false, className = '' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const colorStyles = {
    primary: 'linear-gradient(90deg, var(--app-brand), color-mix(in srgb, var(--app-brand) 70%, #ffe08b))',
    success: 'linear-gradient(90deg, var(--app-success), color-mix(in srgb, var(--app-success) 75%, #a7f3d0))',
    warning: 'linear-gradient(90deg, var(--app-warning), color-mix(in srgb, var(--app-warning) 75%, #fde68a))',
    danger: 'linear-gradient(90deg, var(--app-danger), color-mix(in srgb, var(--app-danger) 70%, #fca5a5))',
    gold: 'linear-gradient(90deg, #e3af11, #ffe04b)',
  }

  return (
    <div className={className}>
      <div className={`progress ${sizes[size]}`}>
        <div
          className="progress-bar"
          style={{ width: `${percentage}%`, background: colorStyles[color] || colorStyles.primary }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs" style={{ color: 'var(--app-text-muted)' }}>
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  )
}

export const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'rounded-full',
    button: 'h-10 rounded-xl',
    card: 'h-32 rounded-2xl',
    image: 'rounded-xl',
  }

  return <div className={`skeleton ${variants[variant]} ${className}`} style={{ width, height }} />
}

export const EmptyState = ({ icon, title, description, action, className = '' }) => (
  <div className={`py-12 text-center ${className}`}>
    {icon && (
      <div
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: 'var(--app-surface-soft)', color: 'var(--app-text-soft)' }}
      >{icon}</div>
    )}
    <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--app-text)' }}>
      {title}
    </h3>
    {description && (
      <p className="mx-auto mb-4 max-w-sm" style={{ color: 'var(--app-text-muted)' }}>
        {description}
      </p>
    )}
    {action}
  </div>
)

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <svg className={`animate-spin ${sizes[size]} ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`tabs ${className}`}>
    {tabs.map((tab) => (
      <button key={tab.id} onClick={() => onChange(tab.id)} className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}>
        {tab.icon && <span className="mr-2">{tab.icon}</span>}
        {tab.label}
      </button>
    ))}
  </div>
)

export const Divider = ({ label, className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="divider" />
    {label && (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="px-3 text-sm" style={{ background: 'var(--app-bg)', color: 'var(--app-text-muted)' }}>
          {label}
        </span>
      </div>
    )}
  </div>
)

export const Tooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && content && (
        <div className={`absolute z-50 whitespace-nowrap rounded-lg px-2 py-1 text-xs text-white ${positions[position]}`} style={{ background: '#111827' }}>
          {content}
        </div>
      )}
    </div>
  )
}
