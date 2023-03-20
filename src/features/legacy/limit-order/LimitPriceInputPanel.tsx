import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Price, Trade, TradeType } from '@sushiswap/core-sdk'
import NumericalInput from 'app/components/Input/Numeric'
import Typography from 'app/components/Typography'
import { useAppDispatch } from 'app/state/hooks'
import { LimitPrice, setLimitOrderInvertState, setLimitPrice } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, { useLimitOrderState } from 'app/state/limit-order/hooks'
import React, { FC } from 'react'

interface LimitPriceInputPanel {
  trade?: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  limitPrice?: Price<Currency, Currency>
}

const LimitPriceInputPanel: FC<LimitPriceInputPanel> = ({ trade, limitPrice }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { limitPrice: limitPriceString, invertRate } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const disabled = !inputCurrency || !outputCurrency

  return (
    <div className="flex flex-col gap-1 z-0">
      <Typography variant="sm" className="px-2 text-white z-[10]">
        {i18n._(t`Rate`)}
      </Typography>
      <div className="flex items-center justify-between h-full px-4 py-2 rounded-md bg-ternary shadow-drop_shadow1">
        <Typography weight={400} variant="sm" className="flex gap-3 flex-grow items-baseline relative overflow-hidden">
          <NumericalInput
            disabled={disabled}
            className="leading-[32px] !text-base font-normal !text-white focus:placeholder:text-low-emphesis placeholder:font-normal flex-grow w-full text-left bg-transparent disabled:cursor-not-allowed"
            placeholder={trade ? trade.executionPrice.toSignificant(6) : '0.0'}
            id="limit-price-input"
            value={
              (limitPriceString === LimitPrice.CURRENT ? trade?.executionPrice.toSignificant(6) : limitPriceString) ||
              ''
            }
            onUserInput={(value) => dispatch(setLimitPrice(value))}
          />
        </Typography>
        <Typography
          variant="sm"
          className="text-white"
          onClick={() =>
            dispatch(
              setLimitOrderInvertState({
                invertRate: !invertRate,
                limitPrice: limitPrice
                  ? !invertRate
                    ? limitPrice?.invert().toSignificant(6)
                    : limitPrice?.toSignificant(6)
                  : '',
              })
            )
          }
        >
          {invertRate ? inputCurrency?.symbol : outputCurrency?.symbol}
        </Typography>
      </div>
    </div>
  )
}

export default LimitPriceInputPanel
