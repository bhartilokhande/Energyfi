import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent, TradeType, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import SwapDetails from 'app/features/legacy/swap/SwapDetails'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { TradeUnion } from 'app/types'
import React, { FC } from 'react'
import { ArrowDown } from 'react-feather'

interface SwapModalHeader {
  trade?: TradeUnion
  allowedSlippage: Percent
  recipient?: string
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}

const SwapModalHeader: FC<SwapModalHeader> = ({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}) => {
  const { i18n } = useLingui()
  const fiatValueInput = useUSDCValue(trade?.inputAmount)
  const fiatValueOutput = useUSDCValue(trade?.outputAmount)

  const change =
    ((Number(fiatValueOutput?.toExact()) - Number(fiatValueInput?.toExact())) / Number(fiatValueInput?.toExact())) * 100

  return (
    <div className="grid gap-2 w-full">
      <div className="flex flex-col">
        <HeadlessUiModal.BorderedContent className="shadow-drop_shadow0 bg-ternary border !border-Gray rounded-[0.350rem] h-14 px-2">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {trade?.inputAmount.toSignificant(6)}{' '}
                </Typography>
                {fiatValueInput?.greaterThan(ZERO) && (
                  <Typography className="text-secondary">${fiatValueInput.toFixed(2)}</Typography>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo
                currency={trade?.inputAmount.currency}
                size={18}
                className="!rounded-full overflow-hidden"
              />
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                {trade?.inputAmount.currency.symbol}
              </Typography>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
        <div className="flex justify-center -mt-3 -mb-3">
          <div className="shadow-btnShadow rounded-full p-2 backdrop-blur-[20px] z-10">
            <ArrowDown size={35} className="p-2 bg-primary rounded-full text-white" />
          </div>
        </div>
        <HeadlessUiModal.BorderedContent className="shadow-drop_shadow0 bg-ternary border !border-Gray rounded-[0.350rem] h-14 px-2">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {trade?.outputAmount.toSignificant(6)}{' '}
                </Typography>
                {fiatValueOutput?.greaterThan(ZERO) && (
                  <Typography className="text-secondary">
                    ${fiatValueOutput?.toFixed(2)}{' '}
                    <Typography variant="xs" component="span">
                      ({change.toFixed(2)}%)
                    </Typography>
                  </Typography>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo
                currency={trade?.outputAmount.currency}
                size={18}
                className="!rounded-full overflow-hidden"
              />
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                {trade?.outputAmount.currency.symbol}
              </Typography>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
      </div>
      <SwapDetails
        trade={trade}
        recipient={recipient}
        inputCurrency={trade?.inputAmount.currency}
        outputCurrency={trade?.outputAmount.currency}
        className="!border-Gray"
      />

      {showAcceptChanges && (
        <HeadlessUiModal.BorderedContent className="border !border-Gray">
          <div className="flex items-center justify-between">
            <Typography variant="sm" weight={700}>
              {i18n._(t`Price Updated`)}
            </Typography>
            <Button variant="outlined" className='h-10 rounded-[0.350rem]' color="green" onClick={onAcceptChanges}>
              {i18n._(t`Accept`)}
            </Button>
          </div>
        </HeadlessUiModal.BorderedContent>
      )}
      <div className="justify-start text-sm text-center text-secondary py-2">
        {trade?.tradeType === TradeType.EXACT_INPUT ? (
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Output is estimated. You will receive at least`)}{' '}
            <Typography variant="xs" className="text-high-emphesis" weight={700} component="span">
              {trade.minimumAmountOut(allowedSlippage).toSignificant(6)} {trade.outputAmount.currency.symbol}
            </Typography>{' '}
            {i18n._(t`or the transaction will revert.`)}
          </Typography>
        ) : (
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Input is estimated. You will sell at most`)}{' '}
            <Typography variant="xs" className="text-high-emphesis" weight={700} component="span">
              {trade?.maximumAmountIn(allowedSlippage).toSignificant(6)} {trade?.inputAmount.currency.symbol}
            </Typography>{' '}
            {i18n._(t`or the transaction will revert.`)}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default SwapModalHeader
