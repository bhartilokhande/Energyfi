import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import Back from 'app/components/Back'
import Button from 'app/components/Button'
import Container from 'app/components/Container'
import Dots from 'app/components/Dots'
import Typography from 'app/components/Typography'
import { NETWORK_LABEL } from 'app/config/networks'
import TransactionList from 'app/features/user/TransactionList'
import { getExplorerLink } from 'app/functions/explorer'
import { shortenAddress } from 'app/functions/format'
import useENSName from 'app/hooks/useENSName'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { clearAllTransactions } from 'app/state/transactions/actions'
import { isTransactionRecent, useAllTransactions } from 'app/state/transactions/hooks'
import { TransactionDetails } from 'app/state/transactions/reducer'
import { useETHBalances } from 'app/state/wallet/hooks'
import Head from 'next/head'
import React, { useCallback, useMemo } from 'react'
import { ExternalLink, User } from 'react-feather'
import useSWR, { SWRResponse } from 'swr'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export default function Me() {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const dispatch = useAppDispatch()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  const { data, error }: SWRResponse<any, Error> = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${account}/stacks/sushiswap/acts/?&key=ckey_cba3674f2ce5450f9d5dd290589&swaps=true&quote-currency=usd`,
    // @ts-ignore TYPE NEEDS FIXING
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((j) => j.data)
  )

  if (error) return <div>{i18n._(t`failed to load`)}</div>
  if (!data) return <div>{i18n._(t`loading...`)}</div>

  return (
    <Container id="user-page" className="py-4 space-y-3 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>My ENERGYFI | Energyfi</title>
        <meta key="description" name="description" content="My Energyfi" />
        <meta key="twitter:description" name="twitter:description" content="My Energyfi" />
        <meta key="og:description" property="og:description" content="My Energyfi" />
      </Head>
      <div className="p-4 mb-3 space-y-3">
        <Back />

        <Typography component="h1" variant="h2" className=" text-high-emphesis">
          {i18n._(t`My Energyfi`)}
        </Typography>
      </div>

      <div className="w-full max-w-2xl p-4 mb-3 rounded bg-dark-900">
        <div className="flex justify-between">
          <div className="flex">
            <div className="p-1.5 bg-dark-800 rounded">
              <User strokeWidth={1} size={34} className="text-white" />
            </div>
            <div className="ml-3">
              <div className="font-semibold text-gray-300">{account && shortenAddress(account)}</div>
              <div className="text-sm text-gray-500">
                {account && chainId && (
                  <>
                    {userEthBalance ? (
                      <div>{userEthBalance?.toSignificant(4)} ETH</div>
                    ) : (
                      <Dots>{i18n._(t`Loading`)}</Dots>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl p-4 rounded bg-dark-900">
        <div className="flex flex-col items-center justify-between mb-3 sm:flex-row">
          <Typography component="h2" variant="lg" className="font-medium text-high-emphesis">
            {i18n._(t`Transaction History ${chainId && NETWORK_LABEL[chainId as ChainId]}`)}
          </Typography>
          <Button variant='filled' color="green" className="w-full h-10 rounded-[0.350rem]"
            onClick={clearAllTransactionsCallback}>
            <span className="text-sm">{i18n._(t`Clear History`)}</span>
          </Button>
        </div>

        {/* TODO: KEEP THIS STYLE BUT FEED WITH AGNOSTIC TX DATA */}
        <TransactionList transactions={data.items} />

        {/* <TransactionList transactions={data.items} /> */}
      </div>
    </Container>
  )
}
