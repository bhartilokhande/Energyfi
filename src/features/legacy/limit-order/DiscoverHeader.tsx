import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React from 'react'

const DiscoverHeader = () => {
  const { i18n } = useLingui()

  return (
    <TridentHeader className="h-40 justify-between items-center maxMd:grid maxMd:my-3">
      <div>
        <Typography variant="h2" className="text-white !text-xl	!font-normal">
          {i18n._(t`Limit Orders`)}
        </Typography>
        <Typography variant="sm" className="text-white" weight={400}>
          {i18n._(t`Place a limit order or check the status of your past orders`)}
        </Typography>
      </div>
      <div className="flex gap-3">
        <Link href="/limit-order" passHref={true}>
          <Button className='bg-Green py-2.5 px-8 rounded-md !text-white text-base font-normal'>
            {i18n._(t`Create Order`)}
          </Button>
        </Link>
      </div>
    </TridentHeader>
  )
}

export default DiscoverHeader
