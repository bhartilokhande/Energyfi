import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import limitOrderPairList from '@sushiswap/limit-order-pair-list/dist/limit-order.pairlist.json'
import { ButtonSwap } from 'app/components/Button'
import Divider from 'app/components/Divider'
import { SwapIcon } from 'app/components/Icon'
import RecipientField from 'app/components/RecipientField'
import Typography from 'app/components/Typography'
import { ZERO_PERCENT } from 'app/constants'
import { Feature } from 'app/enums'
import LimitOrderApprovalCheck from 'app/features/legacy/limit-order/LimitOrderApprovalCheck'
import LimitOrderButton from 'app/features/legacy/limit-order/LimitOrderButton'
import LimitOrderReviewModal from 'app/features/legacy/limit-order/LimitOrderReviewModal'
import LimitPriceInputPanel from 'app/features/legacy/limit-order/LimitPriceInputPanel'
import OrderExpirationDropdown from 'app/features/legacy/limit-order/OrderExpirationDropdown'
import HeaderNew from 'app/features/trade/HeaderNew'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import NetworkGuard from 'app/guards/Network'
import { SwapLayout, SwapLayoutCard } from 'app/layouts/SwapLayout'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { Field, setFromBentoBalance, setRecipient } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, {
  useLimitOrderActionHandlers,
  useLimitOrderDerivedLimitPrice,
  useLimitOrderDerivedParsedAmounts,
  useLimitOrderDerivedTrade,
  useLimitOrderState,
} from 'app/state/limit-order/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import React, { useMemo } from 'react'

const LimitOrder = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const [isExpertMode] = useExpertModeManager()
  const { typedField, typedValue, fromBentoBalance, recipient } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const trade = useLimitOrderDerivedTrade()
  const rate = useLimitOrderDerivedLimitPrice()
  const parsedAmounts = useLimitOrderDerivedParsedAmounts({ rate, trade })
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useLimitOrderActionHandlers()

  const pairs = useMemo(
    // @ts-ignore TYPE NEEDS FIXING
    () => (limitOrderPairList.pairs[chainId || 1] || []).map(([token0, token1]) => [token0.address, token1.address]),
    [chainId]
  )

  const inputPanelHelperText = useMemo(() => {
    if (rate && trade) {
      const { numerator, denominator } = rate.subtract(trade.executionPrice).divide(trade.executionPrice)
      return new Percent(numerator, denominator)
    }
  }, [rate, trade])

  const inputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    // @ts-ignore TYPE NEEDS FIXING
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [pairs])

  const outputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    if (inputCurrency) {
      // @ts-ignore TYPE NEEDS FIXING
      return pairs.reduce((acc, [token0, token1]) => {
        if (inputCurrency.wrapped.address === token0) acc.push(token1)
        if (inputCurrency.wrapped.address === token1) acc.push(token0)
        return acc
      }, [])
    }
    // @ts-ignore TYPE NEEDS FIXING
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [inputCurrency, pairs])

  return (
    <>
      <SwapLayoutCard>
        <LimitOrderApprovalCheck />
        <div className="px-2">
          <HeaderNew className="font-normal" inputCurrency={inputCurrency} outputCurrency={outputCurrency} />
          <Divider className="border-Gray mt-2 mb-4" />
        </div>
        <div className="flex flex-col gap-3">
          <SwapAssetPanel
          className='pb-9'
            error={false}
            header={(props) =>
              <SwapAssetPanel.Header
                popoverPanelClass='maxSm:!w-[19rem] maxSx:!w-[14rem] !max-w-[35rem] mt-2 maxMd:-mt-[2.5rem] !absolute'
                currencyInputClass="grid grid-cols-2 maxMd:grid-cols-1"
                selectcurrencyClass="!bg-transparent"
                walletCLass="flex items-center my-2 justify-between" {...props} isItemShow={true} label={i18n._(t`You pay`)}
              />
            }
            walletToggle={(props) => (
              <SwapAssetPanel.Switch
                id={`switch-classic-withdraw-from-0}`}
                {...props}
                label={i18n._(t`Pay from`)}
                onChange={() => dispatch(setFromBentoBalance(!fromBentoBalance))}
              />
            )}
            selected={true}
            spendFromWallet={!fromBentoBalance}
            currency={inputCurrency}
            value={(typedField === Field.INPUT ? typedValue : parsedAmounts?.inputAmount?.toSignificant(6)) || ''}
            onChange={(value) => onUserInput(Field.INPUT, value || '')}
            onSelect={(inputCurrency) => onCurrencySelection(Field.INPUT, inputCurrency)}
            currencies={inputTokenList}
          />
          <div
            className=
            "grid grid-cols-03 gap-3 maxMd:flex maxMd:justify-around maxMd:mt-5"
          >
            <div className="flex flex-1">
              <LimitPriceInputPanel trade={trade} limitPrice={!!rate ? rate : trade?.executionPrice} />
            </div>
            <div
              className=
              "flex items-center justify-center maxMd:absolute maxMd:z-10  maxMd:-mt-24 z-[0]"
            >
              <div
                role="button"
                className="p-3 rounded-full shadow-darkShadow bg-Gray-900 mt-1.5"
              >
                <ButtonSwap className='p-3 rounded-full shadow-btnShadow bg-primary'
                  onClick={onSwitchTokens}
                >
                  {<SwapIcon />}
                </ButtonSwap>
              </div>
            </div>
            <div className="flex flex-1">
              <OrderExpirationDropdown />
            </div>
          </div>
          <SwapAssetPanel
            error={false}
            header={(props) =>
              <SwapAssetPanel.Header
                popoverPanelClass='maxSm:!w-[19rem] maxSx:!w-[14rem] !max-w-[35rem] mt-2 maxMd:-mt-[2.5rem] !absolute'
                currencyInputClass="grid grid-cols-2 maxMd:grid-cols-1"
                selectcurrencyClass="!bg-transparent"
                walletCLass="flex items-center my-2 justify-end"
                {...props} isItemShow={true} label={i18n._(t`You receive`)}
              />
            }
            selected={true}
            currency={outputCurrency}
            value={(typedField === Field.OUTPUT ? typedValue : parsedAmounts?.outputAmount?.toSignificant(6)) || ''}
            onChange={(value) => onUserInput(Field.OUTPUT, value || '')}
            onSelect={(outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency)}
            currencies={outputTokenList}
            priceImpact={inputPanelHelperText}
            priceImpactCss={inputPanelHelperText?.greaterThan(ZERO_PERCENT) ? 'text-green' : 'text-red'}
          />
        </div>

        {isExpertMode && <RecipientField recipient={recipient} action={setRecipient} />}
        <LimitOrderButton
          trade={trade}
          parsedAmounts={parsedAmounts}
          className="w-full text-base font-normal text-white bg-primary hover:bg-primary/95 rounded-[0.350rem] h-12"
        />
        <LimitOrderReviewModal
          parsedAmounts={parsedAmounts}
          trade={trade}
          limitPrice={!!rate ? rate : trade?.executionPrice}
        />
      </SwapLayoutCard>
      <Typography variant="xs" className="px-10 my-3 italic text-center text-white/60">
        {i18n._(t`Limit orders use funds from BentoBox, to create a limit order depositing into BentoBox is required.`)}
      </Typography>
      <Typography variant="xxs" className="px-10 mt-5 mb-10 italic text-center text-white/60">
        <Typography variant="xxs" weight={700} component="span">
          Tip
        </Typography>
        :{' '}
        {i18n._(t`When expert mode is enabled, balance isn't checked when creating orders. You can use this to chain limit
        orders.`)}
      </Typography>
    </>
  )
}

LimitOrder.Guard = NetworkGuard(Feature.LIMIT_ORDERS)
LimitOrder.Layout = SwapLayout('limit-order-page')

export default LimitOrder
