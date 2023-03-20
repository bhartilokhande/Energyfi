import { classNames } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'

const DoubleGlowShadow: FC<{ className?: string }> = ({ children, className }) => {
  const isDesktop = useDesktopMediaQuery()
  if (!isDesktop) return <>{children}</>

  return (
    <div className={classNames(className, 'relative w-full max-w-2xl flex items-center')}>
      <div className={classNames('fixed inset-0 z-0 pointer-events-none')} />
      <div className="relative filter z-10 w-full">{children}</div>
    </div>
  )
}

export default DoubleGlowShadow
