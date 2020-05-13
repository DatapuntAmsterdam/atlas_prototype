import React, { useCallback, useState } from 'react'

export interface NotificationProps {
  canClose?: boolean
  className?: string
  level?: NotificationLevel
}

export type NotificationLevel = 'alert' | 'info' | 'message' | 'disclaimer'

const Notification: React.FC<NotificationProps> = ({
  level = 'info',
  children,
  className = '',
  canClose = true,
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const hideNotification = useCallback(() => setIsVisible(false), [])

  return isVisible ? (
    <div className={`${className} notification notification--${level} qa-notification`}>
      <span className="notification__content">{children}</span>
      {level !== 'message' && canClose && (
        <button type="button" className="notification__button" onClick={hideNotification}>
          <span className="notification__button--close" />
        </button>
      )}
    </div>
  ) : null
}

export default Notification
