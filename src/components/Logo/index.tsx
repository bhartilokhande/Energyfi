import { classNames } from 'app/functions'
import React, { FC, useState } from 'react'

import Image from '../Image'
import { ELogo } from '../Icon'

export const UNKNOWN_ICON = 'https://energyfi.app/cdn/logo.png'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

interface LogoProps {
  srcs: string[]
  width: string | number
  height: string | number
  alt?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: FC<LogoProps> = ({ srcs, width, height, alt = '', className, style }) => {
  console.log('srcs',srcs)
  const [, refresh] = useState<number>(0)
  const src = srcs.find((src) => {
    return !BAD_SRCS[src]
  })
  // console.log("🚀 ~ file: index.tsx:26 ~ src:", src)
  return (
    <div className="rounded-full flex items-center justify-center" style={{ width, height, ...style }}>
      {src === "ELogo" ?
        <ELogo
          onError={() => {
            if (src) BAD_SRCS[src] = true
            refresh((i) => i + 1)
          }}
          width={Number(width)}
          height={Number(height)}
          // alt={alt}
          // layout="fixed"
          className={classNames('rounded-full   !w-[40px]', className)}
        />
        :
        <Image
          src={src || UNKNOWN_ICON}
          onError={() => {
            if (src) BAD_SRCS[src] = true
            refresh((i) => i + 1)
          }}
          width={width}
          height={height}
          alt={alt}
          layout="fixed"
          className={classNames('rounded-full', className)}
        />
      }
    </div>
  )
}

export default Logo
