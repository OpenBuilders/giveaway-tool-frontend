import { useEffect, memo } from 'react'
import { useLocation } from 'react-router-dom'

interface MainButtonProps {
  text: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  color?: string
  textColor?: string
  isVisible?: boolean
}

export const TelegramMainButton = memo(
  ({
    text,
    onClick,
    disabled = false,
    loading = false,
    color,
    textColor,
    isVisible = true,
  }: MainButtonProps) => {
    const webApp = window.Telegram?.WebApp
    const location = useLocation()

    useEffect(() => {
      if (!webApp?.MainButton) return

      webApp.MainButton.setParams({
        text: text || 'Continue',
        color,
        text_color: textColor,
      })

      webApp.MainButton.onClick(onClick)

      if (isVisible && text) {
        webApp.MainButton.show()
      } else {
        webApp.MainButton.hide()
      }
      return () => {
        webApp.MainButton.offClick(onClick)
        webApp.MainButton.hide()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    // Listen for TON Connect modal close event to restore button state
    useEffect(() => {
      if (!webApp?.MainButton) return

      const handleModalClosed = () => {
        if (isVisible && text) {
          webApp.MainButton.show()
          if (!disabled && !loading) {
            webApp.MainButton.enable()
          }
        }
      }

      window.addEventListener('tonconnect-modal-closed', handleModalClosed)
      
      return () => {
        window.removeEventListener('tonconnect-modal-closed', handleModalClosed)
      }
    }, [webApp, isVisible, text, disabled, loading])

    useEffect(() => {
      if (!webApp?.MainButton) return

      webApp.MainButton.setParams({
        text: text || 'Continue',
        color,
        text_color: textColor,
      })

      if (disabled || loading) {
        webApp.MainButton.disable()
      } else {
        webApp.MainButton.enable()
      }

      if (loading) {
        webApp.MainButton.showProgress()
      } else {
        webApp.MainButton.hideProgress()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled, loading, text])

    useEffect(() => {
      if (webApp.MainButton && onClick) {
        webApp.MainButton.onClick(onClick)

        return () => {
          if (webApp.MainButton) {
            webApp.MainButton.offClick(onClick)
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClick])

    if (
      webApp.platform === 'unknown' &&
      process.env.NODE_ENV !== 'production' &&
      isVisible
    ) {
      return (
        <button
          onClick={onClick}
          style={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10000000000000000,
            height: '56px',
          }}
          disabled={disabled}
        >
          {text}
        </button>
      )
    }

    return null
  }
)
