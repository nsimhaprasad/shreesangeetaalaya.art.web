export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'badge bg-gray-100 text-gray-700',
    primary: 'badge badge-primary',
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    danger: 'badge badge-danger',
    active: 'badge badge-success',
    inactive: 'badge bg-gray-100 text-gray-700',
    suspended: 'badge badge-danger',
    pending: 'badge badge-warning',
    paid: 'badge badge-success',
    none: 'badge bg-gray-100 text-gray-700',
  }

  return <span className={`px-2.5 py-0.5 ${variants[variant] || variants.default}`}>{children}</span>
}
