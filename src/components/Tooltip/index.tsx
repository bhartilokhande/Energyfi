import { classNames } from 'app/functions'
import React, { ReactNode, useCallback, useState } from 'react'

import Popover, { PopoverProps } from '../Popover'

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: ReactNode
  className?: string
}

interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
  content: ReactNode
}

export default function Tooltip({ text, children, className, ...rest }: TooltipProps) {
  return (
    <Popover
      placement="bottom"
      content={
        <div
          className={classNames(
            className,
            'maxMd:mr-[13px] maxSx:max-w-[178px] maxSm:max-w-[178px] max-w-[200px] ml-[28px] px-3 py-2 font-normal bg-popupBg border border-Gray rounded-md text-sm'
          )}
        >
          {text}
        </div>
      }
      {...rest}
    >
      {children}
    </Popover>
  )
}

export function TooltipContent({ content, children, ...rest }: TooltipContentProps) {
  return (
    <Popover content={<div className="w-64 py-[0.6rem] px-4 break-words">{content}</div>} {...rest}>
      {children}
    </Popover>
  )
}

export function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}

export function MouseoverTooltipContent({ content, children, ...rest }: Omit<TooltipContentProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <TooltipContent {...rest} show={show} content={content}>
      <div
        style={{ display: 'inline-block', lineHeight: 0, padding: '0.25rem' }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  )
}
