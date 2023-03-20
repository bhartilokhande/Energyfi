import Image from 'app/components/Image'
import { classNames } from 'app/functions'
import { FC } from 'react'

export type BackgroundVariant =
  | 'miso-bowl'
  | 'bg-bars'
  | 'bg-bubble'
  | 'bg-dots'
  | 'bg-x-times-y-is-k'
  | 'bg-wavy'
  | 'bg-chevron'
  | 'bg-binary'

enum ImageType {
  REPEAT,
  SINGLE,
}

export interface Background {
  variant?: BackgroundVariant
}

const VARIANTS = {
  'bg-bars': {
    type: ImageType.REPEAT,
    url: 'https://energyfi.app/static/media/energyfi.20edbfa3.svg',
  },
  'bg-binary': {
    type: ImageType.REPEAT,
    url: 'https://energyfi.app/static/media/energyfi.20edbfa3.svg',
  },
  'bg-bubble': {
    type: ImageType.REPEAT,
    url: 'https://energyfi.app/static/media/energyfi.20edbfa3.svg',
  },
  'bg-dots': {
    type: ImageType.REPEAT,
    url: 'https://energyfi.app/static/media/energyfi.20edbfa3.svg',
  },
  'bg-x-times-y-is-k': {
    type: ImageType.REPEAT,
    url: 'https://energyfi.app/static/media/energyfi.20edbfa3.svg',
  },
  'bg-wavy': {
    type: ImageType.REPEAT,
    url: 'https://energyfi.app/static/media/energyfi.20edbfa3.svg',
  },
  'bg-chevron': {
    type: ImageType.REPEAT,
    url: 'https://energyfi.app/static/media/energyfi.20edbfa3.svg',
  },
  'miso-bowl': {
    type: ImageType.SINGLE,
    url: 'https://energyfi.app/static/media/energyfi.20edbfa3.svg',
  },
}

const Background: FC<Background> = ({ variant }) => {
  if (!variant) return <div className="absolute inset-0 bg-dark-900/30" />

  const { type, url } = VARIANTS[variant]

  if (type === ImageType.REPEAT) {
    return (
      <div className={classNames('absolute inset-0 flex flex-col items-center bg-dark-900/30')}>
        <div className={classNames('absolute inset-0 w-full h-full z-0 opacity-10', variant)} />
      </div>
    )
  }

  return <Image alt="background image" src={url} objectFit="cover" objectPosition="center" layout="fill" priority />
}

export default Background
