import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, SUSHI, SUSHI_ADDRESS } from '@sushiswap/core-sdk'
import { XSUSHI } from 'app/config/tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalanceV2 } from 'app/state/bentobox/hooks'
import { useTokenBalances } from 'app/state/wallet/hooks'
import { useEffect, useMemo } from 'react'

import useBentoBoxTrait from '../traits/useBentoBoxTrait'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import useBaseStrategy from './useBaseStrategy'

export const GENERAL = (i18n: I18n): StrategyGeneralInfo => ({
  name: i18n._(t`ENERGYFI → Bento`),
  steps: [i18n._(t`ENERGYFI`), i18n._(t`xENERGYFI`), i18n._(t`BentoBox`)],
  zapMethod: 'stakeSushiToBento',
  unzapMethod: 'unstakeSushiFromBento',
  description:
    i18n._(t`Stake ENERGYFI for xENERGYFI and deposit into BentoBox in one click. xENERGYFI in BentoBox is automatically
                invested into a passive yield strategy, and can be lent or used as collateral for borrowing in Kashi.`),
  inputSymbol: i18n._(t`ENERGYFI`),
  outputSymbol: i18n._(t`xENERGYFI in BentoBox`),
})

export const tokenDefinitions: StrategyTokenDefinitions = {
  inputToken: {
    chainId: ChainId.ETHEREUM,
    address: SUSHI_ADDRESS[ChainId.ETHEREUM],
    decimals: 18,
    symbol: 'ENERGYFI',
  },
  outputToken: {
    chainId: ChainId.ETHEREUM,
    address: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
    decimals: 18,
    symbol: 'xENERGYFI',
  },
}

const useStakeSushiToBentoStrategy = (): StrategyHook => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const balances = useTokenBalances(account, [SUSHI[ChainId.ETHEREUM], XSUSHI])
  const { data: xSushiBentoBalance } = useBentoBalanceV2(XSUSHI.address)

  // Strategy ends in BentoBox so use BaseBentoBox strategy
  const general = useMemo(() => GENERAL(i18n), [i18n])
  const baseStrategy = useBaseStrategy({
    id: 'stakeSushiToBentoStrategy',
    general,
    tokenDefinitions,
  })

  // Add in BentoBox trait as output is in BentoBox
  const { setBalances, ...strategy } = useBentoBoxTrait(baseStrategy)

  useEffect(() => {
    if (!balances) return

    setBalances({
      inputTokenBalance: balances[SUSHI_ADDRESS[ChainId.ETHEREUM]],
      outputTokenBalance: xSushiBentoBalance,
    })
  }, [balances, setBalances, xSushiBentoBalance])

  return useMemo(
    () => ({
      setBalances,
      ...strategy,
    }),
    [strategy, setBalances]
  )
}

export default useStakeSushiToBentoStrategy
