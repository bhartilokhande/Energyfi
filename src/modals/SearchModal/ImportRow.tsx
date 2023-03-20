import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/core-sdk'
import Chip from 'app/components/Chip'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { shortenAddress } from 'app/functions'
import React, { FC } from 'react'

interface ImportRow {
  token: Token
  onClick(x: any): void
}

const ImportRow: FC<ImportRow> = ({ token, onClick }) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.BorderedContent className="bg-ternary border border-Gray cursor-pointer rounded-[.350rem] px-2" onClick={onClick}>
      <div className="">
        <div className="flex gap-4 m-2">
          <div className="rounded-full overflow-hidden px-1 flex items-center justify-center">
            <CurrencyLogo currency={token} size={35}/>
          </div>
          <div className=" flex flex-col gap-2">
            <div className="sm:flex gap-4 sm:items-center">
              <Typography variant="lg" className="text-white !font-semibold">
                {token.symbol}{' '}
                <Typography variant="xs" >
                  {token.name}
                </Typography>
              </Typography>
              <Chip color="primary" size="sm" clssName="!text-white" label={i18n._(t`Unknown Source`)}>
                {i18n._(t`Unknown Source`)}
              </Chip>
            </div>
            <Typography variant="xxs" weight={700} className="maxMd:mt-1">
              {shortenAddress(token.address)}
            </Typography>
          </div>
        </div>
      </div>
    </HeadlessUiModal.BorderedContent>
  )
}

export default ImportRow
