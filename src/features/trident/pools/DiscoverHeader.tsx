import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React, { FC } from 'react'

import Button from '../../../components/Button'
import Typography from '../../../components/Typography'

const HeaderButton: FC<{ title: string; linkTo: string; id?: string }> = ({ title, linkTo, id }) => (
  <Link href={linkTo} passHref={true}>
    <Button
      id={id}
      color="btn_primary"
      variant="outlined"
      className="flex-1 text-sm font-bold text-white sm:flex-none md:flex-1 h-9"
    >
      {title}
    </Button>
  </Link>
)

export const DiscoverHeader: FC = () => {
  const { i18n } = useLingui()

  return (
    <TridentHeader className="sm:!flex-row justify-between items-center">
      <div>
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {i18n._(t`Provide liquidity & earn.`)}
        </Typography>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Earn LP fees by depositing tokens to the platform.`)}
        </Typography>
      </div>
      <div className="flex gap-3">
        <Link href="/farm" passHref={true}>
          <Button color="btn_primary" size="sm">
            {i18n._(t`My Positions`)}
          </Button>
        </Link>
        <Link href="/trident/create" passHref={true}>
          <Button color='btn_primary' className='h-10 rounded-[0.350rem]' id="btn-create-new-pool" size="sm">
            {i18n._(t`Create New Pool`)}
          </Button>
        </Link>
      </div>
    </TridentHeader>
  )
}
