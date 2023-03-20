import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'

import Dots from '../Dots'
import Loader from '../Loader'

export type ButtonColor = 'red' | 'blue' | 'pink' | 'purple' | 'gray' | 'orange' | 'green' | 'btn_primary' | 'btnSecondary' | 'Indigo' | 'transparent' | 'btnTernary' |'Green'
export type ButtonSize = 'xs' | 'sm' | 'lg' | 'default' | 'none'
export type ButtonVariant = 'outlined' | 'filled' | 'empty'
export type ButtonDimensions = 'xs' | 'sm' | 'lg' | 'md'

const DIMENSIONS = {
  xs: 'px-2 h-[28px] !border',
  sm: 'px-3 h-[36px]',
  md: 'px-4 h-[52px]',
  lg: 'px-6 h-[60px]',
}

const SIZE = {
  xs: 'text-xs rounded',
  sm: 'text-sm rounded',
  md: 'rounded',
  lg: 'text-lg rounded',
}

const FILLED = {
  default:
    'text-higher-emphesis hover:bg-gradient-to-b hover:from-black/20 focus:to-black/20 focus:bg-gradient-to-b focus:from-black/20 hover:to-black/20 active:bg-gradient-to-b active:from-black/40 active:to-black/40 disabled:pointer-events-none',
  blue: 'bg-blue',
  red: 'bg-red',
  pink: 'bg-pink',
  purple: 'bg-purple',
  gradient:
    '!bg-gradient-to-r from-blue to-pink-600 hover:from-blue/80 hover:to-pink-600/80 focus:from-blue/80 focus:to-pink-600/80 active:from-blue/70 active:to-pink-600/70 focus:border-blue-700',
  gray: 'bg-dark-700',
  transparent: 'bg-transparent',
  Indigo: 'bg-[#a466ff80]',
  btn_primary: 'bg-primary',
  green: 'bg-Green',
  btnSecondary: 'bg-Grean',
  btnTernary: 'bg-ternary',
}

const OUTLINED = {
  default: 'border-2 disabled:pointer-events-none',
  blue: 'border-blue hover:bg-blue/10 active:bg-blue/20 text-blue focus:bg-blue/10',
  red: 'border-red hover:bg-red/10 active:bg-red/20 text-red focus:bg-red/10',
  pink: 'border-pink hover:bg-pink/10 active:bg-pink/20 text-pink focus:bg-pink/10',
  purple: 'border-purple hover:bg-purple/10 active:bg-purple/20 text-purple focus:bg-purple/10',
  gradient: 'border-purple hover:bg-purple/10 active:bg-purple/20 text-purple focus:bg-purple/10',
  gray: 'border-dark-700 hover:bg-dark-700/30 active:bg-dark-700/50 focus:bg-dark-700/30',
  btn_primary: 'border border-primary hover:bg-field',
  green: 'border border-Green',
  transparent: 'bg-transparent',
  btnSecondary: 'bg-Grean',
}

const EMPTY = {
  default:
    'bg-transparent hover:brightness-[90%] focus:brightness-[90%] active:brightness-[80%] disabled:pointer-events-none',
  blue: 'text-blue',
  orange: 'text-orange',
  green: 'text-Green',
  red: 'text-red',
  pink: 'text-pink',
  purple: 'text-purple',
  gray: 'text-higher-emphesis',
  gradient:
    '!bg-gradient-to-r from-blue to-pink-600 hover:from-blue/80 hover:to-pink-600/80 focus:from-blue/80 focus:to-pink-600/80 active:from-blue/70 active:to-pink-600/70',
  btn_primary: 'bg-primary',
  btnSecondary: 'bg-Green',
  Indigo: 'bg-[#a466ff80]',
  transparent: 'bg-transparent',
}

const VARIANT = {
  outlined: OUTLINED,
  filled: FILLED,
  empty: EMPTY,
}

type Button = React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> & {
  Dotted: FC<DottedButtonProps>
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: ReactNode
  endIcon?: ReactNode
  color?: ButtonColor
  dimensions?: ButtonDimensions
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = 'h-10 rounded-[0.350rem]',
      color = 'btn_primary',
      size = 'md',
      dimensions = 'lg',
      variant = 'empty',
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      loading,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          VARIANT[variant]['default'],
          // @ts-ignore TYPE NEEDS FIXING
          VARIANT[variant][color],
          // @ts-ignore TYPE NEEDS FIXING
          SIZE[size],
          // @ts-ignore TYPE NEEDS FIXING
          variant !== 'empty' ? DIMENSIONS[size] : '',
          fullWidth ? 'w-full' : '',
          'font-bold flex items-center justify-center gap-1',
          className
        )}
        {...rest}
      >
        {loading ? (
          <Loader stroke="currentColor" />
        ) : (
          <>
            {startIcon && startIcon}
            {children}
            {endIcon && endIcon}
          </>
        )}
      </button>
    )
  }
)

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean
  disabled?: boolean
} & ButtonProps) {
  if (error) {
    return <Button color="red" size="lg" disabled={disabled} {...rest} />
  } else {
    return <Button color="btn_primary" disabled={disabled} size="lg" {...rest} />
  }
}

interface DottedButtonProps extends ButtonProps {
  pending: boolean
}

export const ButtonDotted: FC<DottedButtonProps> = ({ pending, children, ...rest }) => {
  const buttonText = pending ? <Dots>{children}</Dots> : children
  return (
    <Button {...rest} {...(pending && { disabled: true })}>
      {buttonText}
    </Button>
  )
}

interface ButtonSwapProps extends ButtonProps {
  color?: ButtonColor
}

export const ButtonSwap: FC<ButtonSwapProps> = ({ className, children, ...rest }) => {
  return (
    <Button color='btn_primary' className={className} {...rest}>
      {children}
    </Button>
  )
}
interface ButtonDashboardProps extends ButtonProps {
  color?: ButtonColor
}

export const ButtonDashboard: FC<ButtonDashboardProps> = ({ className, children, ...rest }) => {
  return (
    <Button color='btn_primary' className={className} {...rest}>
      {children}
    </Button>
  )
}

export default Button
