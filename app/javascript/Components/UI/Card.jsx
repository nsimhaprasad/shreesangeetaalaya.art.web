export const Card = ({ children, className = '', hover = false, glass = false, padding = true, ...props }) => {
  const baseClasses = glass ? 'card-glass' : hover ? 'card-elevated' : 'card'

  return (
    <div className={`${baseClasses} ${padding ? 'p-5' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '', action }) => (
  <div
    className={`mb-4 flex items-center justify-between pb-4 border-b ${className}`}
    style={{ borderColor: 'var(--app-border)' }}
  >
    <div>{children}</div>
    {action && <div>{action}</div>}
  </div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold ${className}`} style={{ color: 'var(--app-text)' }}>
    {children}
  </h3>
)

export const CardDescription = ({ children, className = '' }) => (
  <p className={`mt-1 text-sm ${className}`} style={{ color: 'var(--app-text-muted)' }}>
    {children}
  </p>
)

export const CardContent = ({ children, className = '' }) => <div className={className}>{children}</div>

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 border-t pt-4 ${className}`} style={{ borderColor: 'var(--app-border)' }}>
    {children}
  </div>
)

export const StatCard = ({ title, value, change, changeType, icon, className = '' }) => {
  const getChangeStyle = (type) => {
    if (type === 'positive') return { background: 'color-mix(in srgb, var(--app-success) 14%, transparent)', color: 'var(--app-success)' }
    if (type === 'negative') return { background: 'color-mix(in srgb, var(--app-danger) 14%, transparent)', color: 'var(--app-danger)' }
    return { background: 'color-mix(in srgb, var(--app-text-muted) 14%, transparent)', color: 'var(--app-text-muted)' }
  }

  return (
    <div
      className={`rounded-2xl border p-5 hover-lift ${className}`}
      style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>{title}</p>
          <p className="text-2xl font-bold mt-2" style={{ color: 'var(--app-text)', letterSpacing: '-0.02em' }}>
            {value}
          </p>
          {change && (
            <span
              className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
              style={getChangeStyle(changeType)}
            >
              {change}
            </span>
          )}
        </div>
        {icon && (
          <div
            className="rounded-xl p-2.5 flex-shrink-0"
            style={{ background: 'var(--app-brand-soft)', color: 'var(--app-brand)' }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
