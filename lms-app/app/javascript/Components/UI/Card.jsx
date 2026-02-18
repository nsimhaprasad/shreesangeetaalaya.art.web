import { forwardRef } from 'react'

export const Card = ({ children, className = '', hover = false, glass = false, padding = true, ...props }) => {
  const baseClasses = glass 
    ? 'card-glass' 
    : hover 
      ? 'card-elevated' 
      : 'card'

  return (
    <div className={`${baseClasses} ${padding ? 'p-6' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '', action }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div>{children}</div>
    {action && <div>{action}</div>}
  </div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
)

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
)

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>{children}</div>
)

export const StatCard = ({ title, value, change, changeType, icon, className = '' }) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  return (
    <Card hover className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="stat-value mt-2">{value}</p>
          {change && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${changeColors[changeType || 'neutral']}`}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </span>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export default Card
