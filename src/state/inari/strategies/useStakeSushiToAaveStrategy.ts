import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, SUSHI, SUSHI_ADDRESS } from '@sushiswap/core-sdk'
import { AXSUSHI } from 'app/config/tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalances } from 'app/state/wallet/hooks'
import { useEffect, useMemo } from 'react'

import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import useBaseStrategy from './useBaseStrategy'

export const GENERAL = (i18n: I18n): StrategyGeneralInfo => ({
  name: i18n._(t`ENERGYFI → Aave`),
  steps: [i18n._(t`ENERGYFI`), i18n._(t`xENERGYFI`), i18n._(t`Aave`)],
  zapMethod: 'stakeSushiToAave',
  unzapMethod: 'unstakeSushiFromAave',
  description: i18n._(
    t`Stake ENERGYFI for xENERGYFI and deposit into Aave in one click. xENERGYFI in Aave (aXENERGYFI) can be lent or used as collateral for borrowing.`
  ),
  inputSymbol: i18n._(t`ENERGYFI`),
  outputSymbol: i18n._(t`xENERGYFI in Aave`),
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
    address: '0xF256CC7847E919FAc9B808cC216cAc87CCF2f47a',
    decimals: 18,
    symbol: 'aXENERGYFI',
  },
}

const useStakeSushiToAaveStrategy = (): StrategyHook => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const balances = useTokenBalances(account, [SUSHI[ChainId.ETHEREUM], AXSUSHI])
  const general = useMemo(() => GENERAL(i18n), [i18n])
  const { setBalances, ...strategy } = useBaseStrategy({
    id: 'stakeSushiToAaveStrategy',
    general,
    tokenDefinitions,
  })

  useEffect(() => {
    if (!balances) return

    setBalances({
      // @ts-ignore TYPE NEEDS FIXING
      inputTokenBalance: balances[SUSHI[ChainId.ETHEREUM].address],
      outputTokenBalance: balances[AXSUSHI.address],
    })
  }, [balances, setBalances])

  return useMemo(
    () => ({
      ...strategy,
      setBalances,
    }),
    [strategy, setBalances]
  )
}

export default useStakeSushiToAaveStrategy
