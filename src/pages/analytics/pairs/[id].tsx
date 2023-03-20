import { DuplicateIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card from 'app/components/Card'
import Container from 'app/components/Container'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import { BackIcon } from 'app/components/Icon'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import ChartCard from 'app/features/analytics/ChartCard'
import InfoCard from 'app/features/analytics/InfoCard'
import { LegacyTransactions } from 'app/features/transactions/Transactions'
import { getExplorerLink } from 'app/functions/explorer'
import { formatNumber, shortenAddress } from 'app/functions/format'
import { useCurrency } from 'app/hooks/Tokens'
import useCopyClipboard from 'app/hooks/useCopyClipboard'
import { useNativePrice, useOneDayBlock, usePairDayData, useSushiPairs, useTwoDayBlock } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { times } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather';
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

export default function Pair() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()

  const [isCopied, setCopied] = useCopyClipboard()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  const pair = useSushiPairs({ chainId, variables: { where: { id } }, shouldFetch: !!chainId })?.[0]
  const pair1d = useSushiPairs({
    chainId,
    variables: { block: block1d, where: { id } },
    shouldFetch: !!chainId && !!block1d,
  })?.[0]
  const pair2d = useSushiPairs({
    chainId,
    variables: { block: block2d, where: { id } },
    shouldFetch: !!chainId && !!block2d,
  })?.[0]

  const pairDayData = usePairDayData({
    chainId,
    variables: { where: { pair: id?.toLowerCase() } },
    shouldFetch: !!chainId && !!id,
  })

  const nativePrice = useNativePrice({ chainId, shouldFetch: !!chainId })

  // For the charts
  const chartData = useMemo(
    () => ({
      liquidity: pair?.reserveUSD,
      liquidityChange: (pair?.reserveUSD / pair1d?.reserveUSD) * 100 - 100,
      liquidityChart: pairDayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.reserveUSD) })),

      volume1d: pair?.volumeUSD - pair1d?.volumeUSD,
      volume1dChange: ((pair?.volumeUSD - pair1d?.volumeUSD) / (pair1d?.volumeUSD - pair2d?.volumeUSD)) * 100 - 100,
      volumeChart: pairDayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [pair, pair1d, pair2d, pairDayData]
  )

  // For the logos
  const currency0 = useCurrency(pair?.token0?.id)
  const currency1 = useCurrency(pair?.token1?.id)

  // For the Info Cards
  const liquidityUSDChange = pair?.reserveUSD / pair1d?.reserveUSD

  const volumeUSD1d = pair?.volumeUSD - pair1d?.volumeUSD
  const volumeUSD2d = pair1d?.volumeUSD - pair2d?.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  const tx1d = pair?.txCount - pair1d?.txCount
  const tx2d = pair1d?.txCount - pair2d?.txCount
  const tx1dChange = (tx1d / tx2d) * 100 - 100

  const avgTrade1d = volumeUSD1d / tx1d
  const avgTrade2d = volumeUSD2d / tx2d
  const avgTrade1dChange = (avgTrade1d / avgTrade2d) * 100 - 100

  const utilisation1d = (volumeUSD1d / pair?.reserveUSD) * 100
  const utilisation2d = (volumeUSD2d / pair1d?.reserveUSD) * 100
  const utilisation1dChange = (utilisation1d / utilisation2d) * 100 - 100

  return (
    <AnalyticsContainer>
      <Container maxWidth="6xl" className="mx-auto w-full h-full p-3">
        <div className='py-10 flex gap-5'>
          <BackIcon onClick={() => router.back()} className='!cursor-pointer' />
          <Typography variant='h1' component='h1' className="!text-3xl !font-bold text-white ">
            Pair
          </Typography>
        </div>

        <div className="items-center space-y-6 bg-popupBg md:h-24 h-28 flex px-3 rounded">
          <div className="flex md:items-center maxMd:flex-col">
            <div className='flex items-center space-x-4 ' >
              <DoubleCurrencyLogo
                className="-space-x-3"
                logoClassName="rounded-full"
                /* @ts-ignore TYPE NEEDS FIXING */
                currency0={currency0}
                /* @ts-ignore TYPE NEEDS FIXING */
                currency1={currency1}
                size={45}
              />
              <div>
                <div className="text-lg font-bold text-white">
                  {pair?.token0?.symbol}-{pair?.token1?.symbol}
                </div>
                <div className="text-xs text-[#627EEA]">Energyfi Liquidity Pool</div>
              </div>
            </div>
            <div className="rounded-3xl maxMd:mt-2 text-sm bg-[#414A6C] maxMd:w-full maxMd:!max-w-[10rem] py-1 px-2 flex items-center md:space-x-1 md:ml-3">
              <div>{shortenAddress(id)}</div>
              <div className="cursor-pointer" onClick={() => setCopied(id)}>
                {isCopied ? <CheckIcon height={16} /> : <DuplicateIcon height={16} className="scale-x-[-1]" />}
              </div>
            </div>
          </div>
        </div>
        <div className="md:text-3xl text-xl py-6 font-semibold text-white">
          {i18n._(t`Pool Overview`)}
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
                  subheader={`${pair?.token0?.symbol}-${pair?.token1?.symbol}`}
                  figure={chartData.liquidity}
                  change={chartData.liquidityChange}
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
                  subheader={`${pair?.token0?.symbol}-${pair?.token1?.symbol}`}
                  figure={chartData.volume1d}
                  change={chartData.volume1dChange}
                  chart={chartData.volumeChart}
                  defaultTimespan="1W"
                  timespans={chartTimespans}
                />
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {times(2).map((i) => (
              <div key={i} className="w-full p-6 space-y-2 bg-ternary border border-Gray rounded">
                <div className="flex flex-row items-center space-x-2">
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  <CurrencyLogo size={32} currency={[currency0, currency1][i]} />
                  <div className="text-2xl text-white font-bold">{formatNumber([pair?.reserve0, pair?.reserve1][i])}</div>
                  <div className="text-lg text-secondary">{[pair?.token0, pair?.token1][i]?.symbol}</div>
                </div>
                <div className="font-bold">
                  1 {[pair?.token0, pair?.token1][i]?.symbol} = {formatNumber([pair?.token1Price, pair?.token0Price][i])}{' '}
                  {[pair?.token1, pair?.token0][i]?.symbol} (
                  {formatNumber([pair?.token1, pair?.token0][i]?.derivedETH * nativePrice, true)})
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto hide-scrollbar">
            <InfoCard text="Liquidity (24h)" number={pair?.reserveUSD} percent={liquidityUSDChange} />
            <InfoCard text="Volume (24h)" number={volumeUSD1d} percent={volumeUSD1dChange} />
            <InfoCard text="Fees (24h)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto hide-scrollbar">
            <InfoCard text="Tx (24h)" number={!isNaN(tx1d) ? tx1d : ''} numberType="text" percent={tx1dChange} />
            <InfoCard text="Avg. Trade (24h)" number={avgTrade1d} percent={avgTrade1dChange} />
            <InfoCard
              text="Utilisation (24h)"
              number={utilisation1d}
              numberType="percent"
              percent={utilisation1dChange}
            />
          </div>
          <div className="md:text-3xl text-xl py-6 font-semibold text-white">
            {i18n._(t`Information`)}
          </div>
          <div>
            <div className="text-sm leading-48px text-white">
              <table className="w-full table-fixed">
                <thead>
                  <tr>
                    <td>
                      {pair?.token0?.symbol}-{pair?.token1?.symbol} Address
                    </td>
                    <td>{pair?.token0?.symbol} Address</td>
                    <td>{pair?.token1?.symbol} Address</td>
                  </tr>
                </thead>
                <tbody className="">
                  <tr>
                    <td>
                      <div className="flex items-center justify-center w-11/12 space-x-1">
                        <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{pair?.id}</div>
                        <a href={getExplorerLink(chainId, pair?.id, 'token')} target="_blank" rel="noreferrer">
                          <LinkIcon size={16} />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center w-11/12 space-x-1">
                        <Link href={`/analytics/tokens/${pair?.token0?.id}`} passHref>
                          <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                            {pair?.token0?.id}
                          </div>
                        </Link>
                        <a href={getExplorerLink(chainId, pair?.token0?.id, 'token')} target="_blank" rel="noreferrer">
                          <LinkIcon size={16} />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center w-11/12 space-x-1">
                        <Link href={`/analytics/tokens/${pair?.token1?.id}`} passHref>
                          <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                            {pair?.token1?.id}
                          </div>
                        </Link>
                        <a href={getExplorerLink(chainId, pair?.token1?.id, 'token')} target="_blank" rel="noreferrer">
                          <LinkIcon size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <LegacyTransactions pairs={[id]} />
        </div>
      </Container>
    </AnalyticsContainer>
  )
}
