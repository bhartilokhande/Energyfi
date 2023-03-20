import { CheckIcon, DuplicateIcon } from '@heroicons/react/outline'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Card from 'app/components/Card'
import Container from 'app/components/Container'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { BackIcon } from 'app/components/Icon'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import ChartCard from 'app/features/analytics/ChartCard'
import ColoredNumber from 'app/features/analytics/ColoredNumber'
import InfoCard from 'app/features/analytics/InfoCard'
import PairList from 'app/features/analytics/Pairs/PairList'
import { LegacyTransactions } from 'app/features/transactions/Transactions'
import { getExplorerLink } from 'app/functions/explorer'
import { formatNumber, shortenAddress } from 'app/functions/format'
import { useCurrency } from 'app/hooks/Tokens'
import { useTokenContract } from 'app/hooks/useContract'
import useCopyClipboard from 'app/hooks/useCopyClipboard'
import {
  useNativePrice,
  useOneDayBlock,
  useOneWeekBlock,
  useTokenDayData,
  useTokenPairs,
  useTokens,
  useTwoDayBlock,
} from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import Typography from 'app/components/Typography'

const chartTimespans = [
  {
    text: '1W',
    length: 604800,
  },
  {
    text: '1M',
    length: 2629746,
  },
  {
    text: '1Y',
    length: 31556952,
  },
  {
    text: 'ALL',
    length: Infinity,
  },
]

export default function Token() {
  const router = useRouter()
  const id = (router.query.id as string)?.toLowerCase()

  const { chainId } = useActiveWeb3React()

  const [isCopied, setCopied] = useCopyClipboard()

  const [totalSupply, setTotalSupply] = useState(0)
  const tokenContract = useTokenContract(id)

  useEffect(() => {
    const fetch = async () => {
      /* @ts-ignore TYPE NEEDS FIXING */
      setTotalSupply(await tokenContract.totalSupply())
    }
    fetch()
  }, [tokenContract])

  const block1d = useOneDayBlock({ chainId })
  const block2d = useTwoDayBlock({ chainId })
  const block1w = useOneWeekBlock({ chainId })

  // General data (volume, liquidity)
  const nativePrice = useNativePrice({ chainId })
  const nativePrice1d = useNativePrice({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })

  const token = useTokens({ chainId, variables: { where: { id } }, shouldFetch: !!id })?.[0]
  const token1d = useTokens({
    chainId,
    variables: { block: block1d, where: { id } },
    shouldFetch: !!id && !!block1d,
  })?.[0]
  const token2d = useTokens({
    chainId,
    variables: { block: block2d, where: { id } },
    shouldFetch: !!id && !!block2d,
  })?.[0]

  // Token Pairs
  const tokenPairs = useTokenPairs({ chainId, variables: { id } })
  const tokenPairs1d = useTokenPairs({
    chainId,
    variables: { id, block: block1d },
    shouldFetch: !!id && !!block1d,
  })
  const tokenPairs1w = useTokenPairs({
    chainId,
    variables: { id, block: block1w },
    shouldFetch: !!id && !!block1w,
  })

  const tokenPairsFormatted = useMemo(
    () =>
      /* @ts-ignore TYPE NEEDS FIXING */
      tokenPairs?.map((pair) => {
        /* @ts-ignore TYPE NEEDS FIXING */
        const pair1d = tokenPairs1d?.find((p) => pair.id === p.id) ?? pair
        /* @ts-ignore TYPE NEEDS FIXING */
        const pair1w = tokenPairs1w?.find((p) => pair.id === p.id) ?? pair1d

        return {
          pair: {
            token0: pair.token0,
            token1: pair.token1,
            id: pair.id,
          },
          liquidity: pair.reserveUSD,
          volume1d: pair.volumeUSD - pair1d.volumeUSD,
          volume1w: pair.volumeUSD - pair1w.volumeUSD,
        }
      }),
    [tokenPairs, tokenPairs1d, tokenPairs1w]
  )

  // For the logo
  const currency = useCurrency(token?.id)

  // For the Info Cards
  const price = token?.derivedETH * nativePrice
  const priceChange = ((token?.derivedETH * nativePrice) / (token1d?.derivedETH * nativePrice1d)) * 100 - 100

  const liquidityUSD = token?.liquidity * token?.derivedETH * nativePrice
  const liquidityUSDChange =
    ((token?.liquidity * price) / (token1d?.liquidity * token1d?.derivedETH * nativePrice1d)) * 100 - 100

  const volumeUSD1d = token?.volumeUSD - token1d?.volumeUSD
  const volumeUSD2d = token1d?.volumeUSD - token2d?.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  // The Chart
  const tokenDayData = useTokenDayData({
    chainId,
    variables: { where: { token: id.toLowerCase() } },
    shouldFetch: !!id && !!chainId,
  })

  const chartData = useMemo(
    () => ({
      liquidityChart: tokenDayData
        /* @ts-ignore TYPE NEEDS FIXING */
        ?.sort((a, b) => a.date - b.date)
        /* @ts-ignore TYPE NEEDS FIXING */
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.liquidityUSD) })),

      volumeChart: tokenDayData
        /* @ts-ignore TYPE NEEDS FIXING */
        ?.sort((a, b) => a.date - b.date)
        /* @ts-ignore TYPE NEEDS FIXING */
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [tokenDayData]
  )

  return (
    <AnalyticsContainer>
      <Container maxWidth="6xl" className="mx-auto w-full h-full p-3">
        <div className='py-10 flex gap-5'>
          <BackIcon onClick={() => router.back()} className='!cursor-pointer' />
          <Typography variant='h1' component='h1' className="!text-3xl !font-bold text-white ">
            Token
          </Typography>
        </div>
        <div className='flex flex-col gap-6 juastify-center mb-5'>

        </div>
        <div className="items-center bg-popupBg md:h-30 flex p-3 rounded w-full">
          <div className="flex md:items-center maxMd:flex-col w-full">
            <div className='grid md:grid-cols-2 w-full md:items-center gap-4' >
              <div className="flex items-center gap-4">
                <CurrencyLogo className="rounded-full" currency={currency} size={60} />
                <div className='flex flex-col items-center'>
                  <div className="text-lg font-bold text-white">
                    <div className="text-sm font-medium text-secondary">{token?.symbol}</div>
                    <div className="text-lg font-bold text-white">{token?.name}</div>
                  </div>
                  <div className="rounded-3xl text-sm bg-[#414A6C] maxMd:w-full maxMd:!max-w-[10rem] py-1 px-2 max-h-[2rem] flex items-center gap-2">
                    <div>{shortenAddress(id)}</div>
                    <div className="cursor-pointer" onClick={() => setCopied(id)}>
                      {isCopied ? <CheckIcon height={16} /> : <DuplicateIcon height={16} className="scale-x-[-1]" />}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-8 justify-around items-center w-full">
                <div className="flex flex-col">
                  <div>Price</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-medium text-white">{formatNumber(price ?? 0, true)}</div>
                    <ColoredNumber number={priceChange} percent={true} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div>Market Cap</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-medium text-white">
                      {formatNumber(price * (totalSupply / 10 ** token?.decimals) ?? 0, true, false)}
                    </div>
                    <ColoredNumber number={priceChange} percent={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:text-3xl text-xl py-6 font-semibold text-white">
          {i18n._(t`Overview`)}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between maxLg:flex-wrap gap-4 w-full">
            <Card
              cardDesc=" maxLg:p-0 rounded-[0.350rem] h-[20rem]"
              className="w-full max-w-full"
            >
              <div className="bg-ternary border border-Gray rounded">
                <ChartCard
                  header="Liquidity"
                  subheader={token?.symbol}
                  figure={liquidityUSD}
                  change={liquidityUSDChange}
                  chart={chartData.liquidityChart}
                  defaultTimespan="1W"
                  timespans={chartTimespans}
                />
              </div>
            </Card>
            <Card
              cardDesc="maxLg:p-0 rounded-[0.350rem] h-[20rem]"
              className="w-full max-w-full"
            >
              <div className="bg-ternary border border-Gray rounded">
                <ChartCard
                  header="Volume"
                  subheader={token?.symbol}
                  figure={volumeUSD1d}
                  change={volumeUSD1dChange}
                  chart={chartData.volumeChart}
                  defaultTimespan="1W"
                  timespans={chartTimespans}
                />
              </div>
            </Card>
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto hide-scrollbar">
            <InfoCard text="Liquidity (24H)" number={liquidityUSD} percent={liquidityUSDChange} />
            <InfoCard text="Volume (24H)" number={volumeUSD1d} percent={volumeUSD1dChange} />
            <InfoCard text="Fees (24H)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
          </div>
          <div className="text-2xl font-bold text-white">Information</div>
          <div className="px-4 text-sm leading-48px text-white">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Symbol</td>
                  <td>Address</td>
                  <td className="flex justify-end w-full">Moonscan</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{token?.name}</td>
                  <td>{token?.symbol}</td>
                  <td>
                    <div className="w-11/12 overflow-hidden cursor-pointer text-purple overflow-ellipsis whitespace-nowrap">{id}</div>
                  </td>
                  <td>
                    <a
                      className="flex flex-row items-center justify-end space-x-1 text-purple"
                      href={getExplorerLink(chainId, id, 'token')}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div>View</div>
                      <LinkIcon size={16} />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Top Pairs</div>
            <PairList pairs={tokenPairsFormatted} type="all" />
          </div>
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          <LegacyTransactions pairs={tokenPairs ? tokenPairs.map((pair) => pair.id) : []} />
        </div>
      </Container>
    </AnalyticsContainer>
  )
}
