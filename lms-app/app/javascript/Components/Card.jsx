export default function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}
