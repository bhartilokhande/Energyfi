import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import NavLink from 'app/components/NavLink'
import Settings from 'app/components/Settings'
import Typography from 'app/components/Typography'
import MyOrders from 'app/features/legacy/limit-order/MyOrders'
import { classNames } from 'app/functions'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

const getQuery = (input?: Currency, output?: Currency) => {
  if (!input && !output) return

  if (input && !output) {
    // @ts-ignore
    return { inputCurrency: input.address || 'ETH' }
  } else if (input && output) {
    // @ts-ignore
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface HeaderNewProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
  className?: any
}

const HeaderNew: FC<HeaderNewProps> = ({ inputCurrency, outputCurrency, className }) => {
  const { i18n } = useLingui()
  const { asPath } = useRouter()

  return (
    <div className="flex items-center justify-between gap-1">
      <div className="flex gap-6">
        <NavLink
          activeClassName="text-high-emphesis"
          href={{
            pathname: '/swap',
            query: getQuery(inputCurrency, outputCurrency),
          }}
        >
          <Typography className={classNames("text-secondary hover:text-white", className)}>
            {i18n._(t`Swap`)}
          </Typography>
        </NavLink>
      </div>
      <div className="flex items-center gap-2">
        <Settings className="!w-6 !h-6" />
      </div>
    </div>
  )
}

export default HeaderNew
