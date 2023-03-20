import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import Image from 'next/image'
import React from 'react'

export default function Option({
  id,
  link = null,
  onClick = null,
  header,
  subheader = null,
  icon,
  active = false,
  clickable = true,
}: {
  id: string
  link?: string | null
  size?: number | null
  onClick?: null | (() => void)
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  clickable?: boolean
}) {
  const content = (
    <div
      role="button"
      // @ts-ignore TYPE NEEDS FIXING
      onClick={onClick}
      className={classNames(
        clickable ? 'cursor-pointer' : '',
        'bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 justify-between w-full px-4 py-3 rounded-md border border-gray-600 hover:border-purple-600'
      )}
    >
      <div className="flex flex-col gap-1">
        <div id={`wallet-option-${header}`} className="flex items-center">
          <Image src={icon} alt={'Icon'} width="32px" height="32px" />
          <Typography variant="sm" weight={400} className="text-base ml-4">
            {header}
          </Typography>
        </div>
        {subheader && <Typography variant="xs">{subheader}</Typography>}
      </div>
    </div>
  )

  if (link) {
    return <a href={link}>{content}</a>
  }

  return content
}
