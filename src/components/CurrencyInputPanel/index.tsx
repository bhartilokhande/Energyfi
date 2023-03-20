import React, { FC, ReactNode, useCallback, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Pair, Percent, Token } from '@sushiswap/core-sdk'
import selectCoinAnimation from 'app/animation/select-coin.json'
import loadingCircle from 'app/animation/loading-circle.json'
import { classNames } from 'app/functions'
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import Lottie from 'lottie-react'
import Button from '../Button'
import { CurrencyLogo } from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import Input from '../Input'
import Divider from '../Divider'
interface CurrencyInputPanelProps {
  value?: string
  onUserInput?: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: CurrencyAmount<Token> | null
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  allowManageTokenList?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  showSearch?: boolean
  CurrencyInputClass?: string
  currencySelectCss?: string
  popoverPanelClass?: string
  transitionCss?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
  renderBalance,
  hideBalance = false,
  pair = null,
  hideInput = false,
  allowManageTokenList = true,
  showSearch = true,
  CurrencyInputClass,
  currencySelectCss,
  popoverPanelClass,
  transitionCss,
}: CurrencyInputPanelProps) {
  const { i18n } = useLingui()
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  interface CurrencySelectProps { }

  const CurrencySelect: FC<CurrencySelectProps> = () => {
    return (
      <button
        type="button"
        className={classNames(
          !!currency ? 'text-white' : 'text-high-emphesis',
          'open-currency-select-button h-full outline-none select-none cursor-pointer border-none text-xl font-medium items-center'
        )}
        onClick={() => {
          if (onCurrencySelect) {
            setModalOpen(true)
          }
        }}>
        <div className={currencySelectCss || 'border !flex rounded-md border-gray-600 h-14 relative'}>
          <div className="flex">
            {pair ? (
              <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={54} margin={true} />
            ) : currency ? (
              <div className="flex items-center ml-1.5 ">
                <CurrencyLogo currency={currency} size={'30px'} />
              </div>
            ) : (
              <div className="rounded bg-dark-700" style={{ maxWidth: 54, maxHeight: 54 }}>
                <div style={{ width: 54, height: 54 }}>
                  <Lottie animationData={loadingCircle} autoplay loop />
                </div>
              </div>
            )}
            {pair ? (
              <span
                className={classNames(
                  'pair-name-container',
                  Boolean(currency && currency.symbol) ? 'text-2xl' : 'text-xs'
                )}>
                {pair?.token0.symbol}:{pair?.token1.symbol}
              </span>
            ) : (
              <div className="!w-full flex flex-1 flex-col items-start justify-center mx-3.5">
                <div className="flex items-center">
                  <div className="!w-full text-lg font-semibold token-symbol-container  ">
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      : currency?.symbol) || (
                        <div className="w-full text-base font-normal text-white bg-Green hover:bg-Green/95 rounded-[0.350rem] h-12 flex items-center justify-center p-5">
                          {i18n._(t`Select Token`)}
                        </div>
                      )}
                  </div>
                  {!disableCurrencySelect && currency && (
                    <ChevronDownIcon width={16} height={16} className="ml-2 stroke-current  absolute right-4" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </button>
    )
  }

  const InputField: JSX.Element = React.useMemo(() => {
    return (
      <div>
        {!hideInput && (
          <div
            className={classNames('flex items-center w-full space-x-3')}>
            <>
              <Input.Numeric
                id="token-amount-input"
                className='indent-0 bg-transparent'
                // @ts-ignore TYPE NEEDS FIXING
                value={value}
                onUserInput={(val) => {
                  // @ts-ignore TYPE NEEDS FIXING
                  onUserInput(val)
                }} />
              <Divider className="border-Gray" />
              {!hideBalance && currency && selectedCurrencyBalance ? (
                <div className="flex flex-col">
                  <div onClick={onMax} className="text-xs font-medium text-right cursor-pointer text-low-emphesis">
                    {renderBalance ? (
                      renderBalance(selectedCurrencyBalance)
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ) : null}
            </>
          </div>
        )}
        <Divider className="border-Gray" />
      </div>
    )
  }, [hideInput, hideBalance, currency, value, selectedCurrencyBalance])

  return (
    <div id={id} className={classNames(hideInput ? 'p-4' : "px-6 maxMd:px-4 pt-6 pb-10 rounded-[0.350rem] bg-ternary", CurrencyInputClass)}>
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row relative">
        <div className={classNames('w-full')}>
          {label && <div className="text-xs font-medium text-secondary whitespace-nowrap mb-1.5">{label}</div>}
          <div className={classNames('grid grid-cols-2 gap-6 maxMd:grid-cols-1 maxMd:gap-[0.5rem] items-center w-full')} >
            <CurrencySelect />
            {showMaxButton && selectedCurrencyBalance && (
              <Button
                className='!rounded-[0.350rem] border-[thin] !font-normal text-white !h-14'
                variant="outlined"
                color="green"
                onClick={onMax}
              >
                {i18n._(t`Max`)}
              </Button>
            )}
            {InputField}
          </div>
        </div>
        {!disableCurrencySelect && onCurrencySelect && (
          <CurrencySearchModal.Controlled
            open={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={currency ?? undefined}
            otherSelectedCurrency={otherCurrency ?? undefined}
            showCommonBases={showCommonBases}
            allowManageTokenList={allowManageTokenList}
            showSearch={showSearch}
            popoverPanelClass={popoverPanelClass}
            transitionCss={transitionCss}
          />
        )}
      </div>
    </div>
  )
}