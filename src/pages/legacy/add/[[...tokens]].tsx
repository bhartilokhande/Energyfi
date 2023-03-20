import React, { useCallback, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, currencyEquals, WNATIVE } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import Container from 'app/components/Container'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import { MinimalPositionCard } from 'app/components/PositionCard'
import Web3Connect from 'app/components/Web3Connect'
import { ZERO_PERCENT } from 'app/constants'
import { ConfirmAddModalBottom } from 'app/features/legacy/liquidity/ConfirmAddModalBottom'
import LiquidityPrice from 'app/features/legacy/liquidity/LiquidityPrice'
import UnsupportedCurrencyFooter from 'app/features/legacy/swap/UnsupportedCurrencyFooter'
import ExchangeHeader from 'app/features/trade/Header'
import { currencyId, maxAmountSpend } from 'app/functions/currency'
import { calculateGasMargin, calculateSlippageAmount } from 'app/functions/trade'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { useRouterContract } from 'app/hooks/useContract'
import { useIsSwapUnsupported } from 'app/hooks/useIsSwapUnsupported'
import useTransactionDeadline from 'app/hooks/useTransactionDeadline'
import { PairState } from 'app/hooks/useV2Pairs'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { SwapLayoutCard } from 'app/layouts/SwapLayout'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel';
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { useAppSelector } from 'app/state/hooks'
import { Field } from 'app/state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'app/state/mint/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice';
import { useTransactionAdder } from 'app/state/transactions/hooks';
import { useExpertModeManager } from 'app/state/user/hooks';
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery';
import Web3Status from 'app/components/Web3Status';
import { BackIcon } from 'app/components/Icon'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'

export default function Add() {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [undefined, undefined]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
    ((currencyA && currencyEquals(currencyA, WNATIVE[chainId])) ||
      (currencyB && currencyEquals(currencyB, WNATIVE[chainId])))
  )

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const [isExpertMode] = useExpertModeManager()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const allowedSlippage = useAppSelector(selectSlippage)

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  const routerContract = useRouterContract()

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], routerContract?.address)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], routerContract?.address)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.addLiquidityETH
      args = [
        (tokenBIsETH ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).quotient.toString())
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.addLiquidity
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: i18n._(
              t`Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencies[Field.CURRENCY_A]?.symbol
                } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`
            ),
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
          })
        })
      )
      .catch((error) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== USER_REJECTED_TX) {
          console.error(error)
        }
      })
  }

  const ModalHeader = noLiquidity ? (
    <div className="pb-4">
      <div className="flex items-center justify-start gap-3">
        <div className="text-2xl font-bold text-white">
          {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
        </div>
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={48} />
      </div>
    </div>
  ) : (
    <div className="">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xl font-bold md:text-lg text-white">
          {liquidityMinted?.toSignificant(6)}
          <div className="text-xl font-medium md:text-sm text-white">
            {currencies[Field.CURRENCY_A]?.symbol}/{currencies[Field.CURRENCY_B]?.symbol}
            &nbsp;{i18n._(t`Pool Tokens`)}
          </div>
        </div>
        <div className="grid grid-flow-col gap-2">
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={48} />
        </div>
      </div>
      <div className="pt-3 text-xs italic text-secondary">
        {i18n._(t`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
          4
        )}% your transaction
            will revert.`)}
      </div>
    </div>
  )

  const ModalBottom = (
    <ConfirmAddModalBottom
      price={price}
      currencies={currencies}
      parsedAmounts={parsedAmounts}
      noLiquidity={noLiquidity}
      onAdd={onAdd}
      poolTokenPercentage={poolTokenPercentage}
    />
  )

  const pendingText = i18n._(
    t`Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencies[Field.CURRENCY_A]?.symbol
      } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`
  )

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        router.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        router.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, router, currencyIdA]
  )

  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          router.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        router.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, router, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  const isDesktop = useDesktopMediaQuery()
  return (
    <>
      <div className='w-full h-full flex items-center'>
        <Container id="add-liquidity-page" className="my-0 mx-auto py-10 pb-20 md:pb-20">
          <Head>
            <title>Add Liquidity | Energyfi</title>
            <meta
              key="description"
              name="description"
              content="Add liquidity to the EnergyFiSwap AMM to enable gas optimised and low slippage trades across countless networks"
            />
            <meta
              key="twitter:description"
              name="twitter:description"
              content="Add liquidity to the EnergyFiSwap AMM to enable gas optimised and low slippage trades across countless networks"
            />
            <meta
              key="og:description"
              property="og:description"
              content="Add liquidity to the EnergyFiSwap AMM to enable gas optimised and low slippage trades across countless networks"
            />
          </Head>

          <Alert
            className='mx-1 maxMd:mx-2 mb-3 md:mb-5'
            message={
              noLiquidity ? (
                i18n._(
                  t`When creating a pair you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click supply to review`
                )
              ) : (
                <>
                  <b>{i18n._(t`Tip:`)}</b>{' '}
                  {i18n._(
                    t`By adding liquidity you'll earn 0.25% of all trades on this pair
                proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be
                claimed by withdrawing your liquidity.`
                  )}
                </>
              )}
            type="information"
          />

          <DoubleGlowShadow>
              <TransactionConfirmationModal
                isOpen={showConfirm}
                onDismiss={handleDismissConfirmation}
                attemptingTxn={attemptingTxn}
                hash={txHash}
                content={
                  <ConfirmationModalContent
                    title={noLiquidity ? i18n._(t`You are creating a pool`) : i18n._(t`You will receive`)}
                    onDismiss={handleDismissConfirmation}
                    topContent={ModalHeader}
                    bottomContent={ModalBottom}
                  />
                }
                pendingText={pendingText}
              />
              </DoubleGlowShadow>
            <div className="space-y-4 maxMd:mx-2">
              <SwapLayoutCard>
                <BackIcon
                  onClick={() => router.back()} className='cursor-pointer mb-3 w-[15px] h-[15px] md:w-[20px] md:h-[20px]' />
                <ExchangeHeader
                  input={currencies[Field.CURRENCY_A]}
                  output={currencies[Field.CURRENCY_B]}
                  allowedSlippage={allowedSlippage}
                />
                <div className="flex flex-col gap-3">
                  <SwapAssetPanel
                    header={(props) => (
                      <SwapAssetPanel.Header
                        popoverPanelClass='w-full !absolute'
                        transitionCss="w-full max-w-[100%]"
                        currencyInputClass="relative -mb-2 mt-2"
                        {...props}
                      />
                    )}
                    spendFromWallet={true}
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onChange={onFieldAInput}
                    onSelect={handleCurrencyASelect}
                    currency={currencies[Field.CURRENCY_A]}
                  />
                </div>
                <div className='flex justify-center items-center'>
                  <Button className="z-10 -my-9 rounded-full bg-Gray-900 shadow-btnShadow p-2.5">
                    <div className="p-2.5 rounded-full bg-primary">
                      <Plus size="32" stroke-width="1" color='white' />
                    </div>
                  </Button>
                </div>
                <SwapAssetPanel
                  header={(props) => (
                    <SwapAssetPanel.Header
                      popoverPanelClass='w-full !absolute'
                      transitionCss="w-full max-w-[100%]"
                      currencyInputClass="relative -mb-3 mt-2 "
                      {...props}
                    />
                  )}
                  spendFromWallet={true}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onChange={onFieldBInput}
                  onSelect={handleCurrencyBSelect}
                  currency={currencies[Field.CURRENCY_B]}
                />
                {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                  <div className="px-1 py-2 rounded">
                    <LiquidityPrice
                      currencies={currencies}
                      price={price}
                      noLiquidity={noLiquidity}
                      poolTokenPercentage={poolTokenPercentage}
                      className="!bg-black/10"
                    />
                  </div>
                )}

                {addIsUnsupported ? (
                  <Button color="red" variant="filled" disabled fullWidth className="w-full text-base font-normal text-white bg-primary rounded-[0.350rem] h-12">
                    {i18n._(t`Unsupported Asset`)}
                  </Button>
                ) : !account ? (
                  <>
                    {
                      isDesktop ? <Web3Connect className="w-full text-base font-normal text-white bg-primary hover:bg-primary/95 rounded-[0.350rem] !h-12" />
                        :
                        <Web3Status web3ConnectClass="bg-primary hover:bg-primary/90 hover:text-white/90 font-normal text-white rounded-[0.350rem]  w-full !h-12" />
                    }
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    {approvalA !== ApprovalState.APPROVED && approvalA !== ApprovalState.UNKNOWN && (
                      <Button
                        loading={approvalA === ApprovalState.PENDING}
                        fullWidth
                        variant="filled"
                        onClick={approveACallback}
                        disabled={approvalA === ApprovalState.PENDING}
                        className="w-full text-base font-normal text-white rounded-[0.350rem] h-12"
                      >
                        {i18n._(t`Approve ${currencies[Field.CURRENCY_A]?.symbol}`)}
                      </Button>
                    )}
                    {approvalB !== ApprovalState.APPROVED && approvalB !== ApprovalState.UNKNOWN && (
                      <Button
                        loading={approvalB === ApprovalState.PENDING}
                        fullWidth
                        variant="filled"
                        onClick={approveBCallback}
                        disabled={approvalB === ApprovalState.PENDING}
                        className="w-full text-base font-normal text-white rounded-[0.350rem] h-12"
                      >
                        {i18n._(t`Approve ${currencies[Field.CURRENCY_B]?.symbol}`)}
                      </Button>
                    )}

                    <Button
                      fullWidth
                      variant="filled"
                      onClick={() => {
                        isExpertMode ? onAdd() : setShowConfirm(true)
                      }}
                      disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                      className="w-full text-base font-normal text-white rounded-[0.350rem] h-12"
                    >
                      {error ?? i18n._(t`Add Liquidity`)}
                    </Button>
                  </div>
                )}

                {addIsUnsupported && <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />}
              </SwapLayoutCard>
              {!addIsUnsupported ? (
                pair && !noLiquidity && pairState !== PairState.INVALID ? (
                  <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                ) : null
              ) : (
                <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />
              )}
            </div>
        </Container>
      </div>
    </>
  )
}