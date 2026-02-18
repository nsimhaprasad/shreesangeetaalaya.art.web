import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showClose = true 
}) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]'
  }

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return createPortal(
    <div className="modal" onClick={onClose}>
      <div className="modal-overlay" />
      <div 
        className={`modal-content ${sizes[size]}`}
        onClick={e => e.stopPropagation()}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between border-b p-4" style={{ borderColor: 'var(--app-border)' }}>
            {title && (
              <h3 className="text-lg font-semibold" style={{ color: 'var(--app-text)' }}>
                {title}
              </h3>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                style={{ color: 'var(--app-text-muted)' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) {
  const buttonVariants = {
    danger: 'btn-danger',
    primary: 'btn-primary',
    warning: 'btn bg-amber-500 text-white hover:bg-amber-600'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="mb-6" style={{ color: 'var(--app-text-muted)' }}>{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary">
          {cancelText}
        </button>
        <button 
          onClick={() => { onConfirm(); onClose(); }} 
          className={buttonVariants[variant]}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
