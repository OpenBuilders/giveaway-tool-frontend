import cn from 'classnames'

import styles from './Text.module.scss'

interface TextProps {
  children: React.ReactNode | string
  type: 'title' | 'title1' | 'title2' | 'text' | 'link' | 'caption' | 'caption2'
  align?: 'left' | 'center' | 'right'
  color?: 'primary' | 'tertiary' | 'secondary' | 'accent' | 'danger' | 'hint'
  weight?: 'normal' | 'medium' | 'bold' | 'semibold'
  href?: string
  as?: 'p' | 'span' | 'div' | 'a'
  uppercase?: boolean
  className?: string
}

export const Text = ({
  children,
  type = 'text',
  align = 'left',
  color = 'primary',
  weight = 'normal',
  href,
  as = 'p',
  uppercase,
  className,
}: TextProps) => {
  const Component = as
  return (
    <Component
      className={cn(
        styles.container,
        styles[type],
        styles[align],
        styles[color],
        styles[weight],
        uppercase && styles.uppercase,
        className
      )}
      {...(href && { href })}
      {...(as && { as })}
    >
      {children}
    </Component>
  )
}
