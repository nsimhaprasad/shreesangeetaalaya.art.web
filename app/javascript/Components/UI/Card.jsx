import { forwardRef } from 'react'

export const Card = ({ children, className = '', hover = false, glass = false, padding = true, ...props }) => {
  const baseClasses = glass ? 'card-glass' : hover ? 'card-elevated' : 'card'

  return (
    <div className={`${baseClasses} ${padding ? 'p-6' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '', action }) => (
  <div className={`mb-4 flex items-center justify-between ${className}`}>
    <div>{children}</div>
    {action && <div>{action}</div>}
  </div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`} style={{ color: 'var(--app-text)' }}>
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
  const changeColors = {
    positive: 'text-emerald-700 bg-emerald-100',
    negative: 'text-rose-700 bg-rose-100',
    neutral: 'text-gray-700 bg-gray-100',
  }

  return (
    <Card className={`stat-card ${className}`} hover>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--app-text-muted)' }}>
            {title}
          </p>
          <p className="stat-value mt-2">{value}</p>
          {change && (
            <span className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${changeColors[changeType || 'neutral']}`}>
              {changeType === 'positive' && 'up'}
              {changeType === 'negative' && 'down'}
              {change}
            </span>
          )}
        </div>
        {icon && (
          <div className="rounded-xl p-3 text-primary-700" style={{ background: 'var(--app-brand-soft)' }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export default Card
