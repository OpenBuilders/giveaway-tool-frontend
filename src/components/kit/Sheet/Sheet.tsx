import cn from 'classnames'
import { ReactNode, useEffect, useState, TouchEvent } from 'react'

import styles from './Sheet.module.scss'

interface Sheet {
  onClose(): void
  opened?: boolean
  children?: ReactNode
}

export function Sheet({ children, opened, onClose }: Sheet) {
  const [isActiveState, setIsActiveState] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)

  useEffect(() => {
    if (opened) {
      setIsActiveState(true)
      setDragOffset(0)
    }

    if (!opened) {
      setTimeout(() => {
        setIsActiveState(false)
      }, 300)
    }
  }, [opened])

  const onTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const diff = currentY - startY
    // Allow slight resistance or simply block negative drag if preferred.
    // Only allowing pull down for now.
    if (diff > 0) {
      setDragOffset(diff)
    }
  }

  const onTouchEnd = () => {
    setIsDragging(false)
    if (dragOffset > 50) { // Increased threshold for better UX
      onClose()
    } else {
      setDragOffset(0)
    }
  }

  if (!isActiveState) return null

  return (
    <>
      <div
        className={cn(styles.root, opened && styles.rootActive)}
        onClick={onClose}
      ></div>

      <div
        className={cn(styles.sheet, opened && styles.sheetActive)}
        style={{
          transform:
            opened && dragOffset > 0
              ? `translateY(calc(-100% + ${dragOffset}px))`
              : undefined,
          transition: isDragging ? 'none' : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            zIndex: 10,
            touchAction: 'none',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
        <div className={styles.cross} onClick={onClose} />
        <div className={styles.content}>{children}</div>
      </div>
    </>
  )
}
