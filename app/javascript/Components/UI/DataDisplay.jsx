import { useState } from 'react'

export const Badge = ({ children, variant = 'default', size = 'md', dot = false, className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'badge-primary',
    secondary: 'bg-secondary-100 text-secondary-700',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    gold: 'bg-gold-100 text-gold-800',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span className={`badge ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span
          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-emerald-500'
              : variant === 'warning'
                ? 'bg-amber-500'
                : variant === 'danger'
                  ? 'bg-rose-500'
                  : variant === 'info'
                    ? 'bg-sky-500'
                    : 'bg-gray-500'
          }`}
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
        <div className={`avatar ${size === 'md' ? 'avatar-md' : 'avatar-sm'} ring-2 ring-white/70 bg-gray-200 text-gray-700`}>+{remaining}</div>
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

  const colors = {
    primary: 'from-primary-500 to-primary-400',
    success: 'from-emerald-500 to-emerald-400',
    warning: 'from-amber-500 to-amber-400',
    danger: 'from-rose-500 to-rose-400',
    gold: 'from-gold-500 to-gold-400',
  }

  return (
    <div className={className}>
      <div className={`progress ${sizes[size]}`}>
        <div className={`progress-bar bg-gradient-to-r ${colors[color]}`} style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <p className="mt-1 text-right text-xs text-gray-500">{Math.round(percentage)}%</p>}
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
    {icon && <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">{icon}</div>}
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
