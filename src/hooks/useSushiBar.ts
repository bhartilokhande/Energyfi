import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

import { useSushiBarContract } from './useContract'

const useSushiBar = () => {
  const addTransaction = useTransactionAdder()
  const barContract = useSushiBarContract()

  const enter = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.enter(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Enter EnergyFiBar' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, barContract]
  )

  const leave = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.leave(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Leave EnergyFiBar' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, barContract]
  )

  return { enter, leave }
}

export default useSushiBar
