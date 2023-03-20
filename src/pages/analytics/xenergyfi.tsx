import { ChainId, SUSHI_ADDRESS } from '@sushiswap/core-sdk'
import Container from 'app/components/Container'
import { BackIcon } from 'app/components/Icon'
import TimespanGraph from 'app/components/TimespanGraph'
import Typography from 'app/components/Typography'
import { XEFT_CALL } from 'app/config/tokens'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import InfoCard from 'app/features/analytics/Bar/InfoCard'
import ColoredNumber from 'app/features/analytics/ColoredNumber'
import { classNames, formatNumber, formatPercent } from 'app/functions'
import { aprToApy } from 'app/functions/convert/apyApr'
import { useDayData, useFactory, useNativePrice, useOneDayBlock, useTokenDayData, useTokens } from 'app/services/graph'
import { useBar, useBarHistory } from 'app/services/graph/hooks/bar'
import Link from 'next/link'
import router from 'next/router'
import React, { useMemo } from 'react'

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

export default function xEnergyfi() {
  const block1d = useOneDayBlock({ chainId: ChainId.MOONBEAM })

  const exchange = useFactory({ chainId: ChainId.MOONBEAM })

  const exchange1d = useFactory({
    chainId: ChainId.MOONBEAM,
    variables: {
      block: block1d,
    },
  })

  const dayData = useDayData({ chainId: ChainId.MOONBEAM })

  const ethPrice = useNativePrice({ chainId: ChainId.MOONBEAM })

  const ethPrice1d = useNativePrice({
    chainId: ChainId.MOONBEAM,
    variables: { block: block1d },
    shouldFetch: !!block1d,
  })

  const xEnergyFI = useTokens({
    chainId: ChainId.MOONBEAM,
    variables: { where: { id: XEFT_CALL.address.toLowerCase() } },
  })?.[0]

  const xEnergyFI1d = useTokens({
    chainId: ChainId.MOONBEAM,
    variables: { block: block1d, where: { id: XEFT_CALL.address.toLowerCase() } },
  })?.[0]

  const energyFIDayData = useTokenDayData({
    chainId: ChainId.MOONBEAM,
    variables: { where: { token: SUSHI_ADDRESS[ChainId.MOONBEAM].toLowerCase() } },
  })

  const bar = useBar()

  const bar1d = useBar({ variables: { block: block1d }, shouldFetch: !!block1d })

  const barHistory = useBarHistory()

  const [xEnergyFIPrice, xEnergyFIMarketcap] = [
    xEnergyFI?.derivedETH * ethPrice,
    xEnergyFI?.derivedETH * ethPrice * bar?.totalSupply,
  ]

  const [xEnergyFIPrice1d, xEnergyFIMarketcap1d] = [
    xEnergyFI1d?.derivedETH * ethPrice1d,
    xEnergyFI1d?.derivedETH * ethPrice1d * bar1d?.totalSupply,
  ]

  const data = useMemo(
    () =>
      barHistory && dayData && energyFIDayData && bar
        ? // @ts-ignore TYPE NEEDS FIXING
        barHistory.map((barDay) => {
          // @ts-ignore TYPE NEEDS FIXING
          const exchangeDay = dayData.find((day) => day.date === barDay.date)
          //@ts-ignore TYPE NEEDS FIXING
          const energyFIDay = energyFIDayData.filter((day) => {
            if (day.date === barDay.date) {
            }
          })

          const totalEnergyFIStakedUSD = barDay.xEnergyFISupply * barDay.ratio * energyFIDay?.priceUSD

          const APR =
            totalEnergyFIStakedUSD !== 0 ? ((exchangeDay.volumeUSD * 0.0005 * 365) / totalEnergyFIStakedUSD) * 100 : 0

          return {
            APR: APR,
            APY: aprToApy(APR, 365),
            xEnergyFISupply: barDay.xEnergyFISupply,
            date: barDay.date,
            feesReceived: exchangeDay.volumeUSD * 0.0005,
            energyFIStaked: barDay.energyFIStaked,
            energyFIHarvested: barDay.energyFIHarvested,
          }
        })
        : [],
    [barHistory, dayData, energyFIDayData, bar]
  )

  const APY1d = aprToApy(
    (((exchange?.volumeUSD - exchange1d?.volumeUSD) * 0.0005 * 365.25) / (bar?.totalSupply * xEnergyFIPrice)) * 100 ?? 0
  )
  // @ts-ignore TYPE NEEDS FIXING
  const APY1w = aprToApy(data.slice(-7).reduce((acc, day) => (acc += day.APY), 0) / 7)

  const graphs = useMemo(
    () => [
      {
        title: 'xEnergyfi Performance',
        labels: ['Daily APY', 'Daily APR'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.APY,
          })),
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.APR,
          })),
        ],
      },
      {
        title: 'Daily Fees Received',
        labels: ['Fees (USD)'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.feesReceived,
          })),
        ],
      },
      {
        title: 'xEnergyfi Supply Movements',
        labels: ['Daily Minted', 'Daily Burned'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.energyFIStaked,
          })),
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.energyFIHarvested,
          })),
        ],
      },
      {
        title: 'xEnergyfi Total Supply',
        labels: ['Supply'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.xEnergyFISupply,
          })),
        ],
      },
    ],
    [data]
  )

  return (
    <AnalyticsContainer>
      <Container maxWidth="6xl" className="mx-auto w-full h-full mb-8">
        <div className='py-10'>
          <BackIcon onClick={() => router.back()} className='cursor-pointer mt-5 mb-8' />
          <div className="grid items-center flex justify-between grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
            <div className="space-y-5">
              <Typography variant='h1' component='h1' className="!text-3xl !font-bold text-white">
                xEFT Analytics
              </Typography>
              <Typography className="!font-normal text-xl text-white">Find out all about xEnergyfi here.</Typography>
            </div>
            <div className="flex justify-end space-x-12">
              <div className="flex flex-col">
                <div>Price</div>
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-medium text-high-emphesis">{formatNumber(xEnergyFIPrice ?? 0, true)}</div>
                  <ColoredNumber number={(xEnergyFIPrice / xEnergyFIPrice1d) * 100 - 100} percent={true} />
                </div>
              </div>
              <div className="flex flex-col">
                <div>Market Cap</div>
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-medium text-high-emphesis">
                    {formatNumber(xEnergyFIMarketcap ?? 0, true, false)}
                  </div>
                  <ColoredNumber number={(xEnergyFIMarketcap / xEnergyFIMarketcap1d) * 100 - 100} percent={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 space-y-5">
          <div className="flex flex-col md:flex-row w-full gap-3">
            <InfoCard text="APY (Last 24 Hours)" number={formatPercent(APY1d)} />
            <InfoCard text="APY (Last 7 Days)" number={formatPercent(APY1w)} />
            <InfoCard text="xEnergyfi Supply" number={formatNumber(bar?.totalSupply)} />
            <InfoCard text="xEnergyfi : Energyfi" number={Number(bar?.ratio ?? 0)?.toFixed(4)} />
          </div>
          <div className="space-y-4">
            {graphs.map((graph, i) => (
              <div
                className={classNames(
                  graph.data[0].length === 0 && 'hidden',
                  'p-1 rounded-[0.350rem] overflow-auto hide-scrollbar bg-ternary border border-Gray'
                )}
                key={i}
              >
                <div className="w-full h-96 min-w-[768px]">
                  <TimespanGraph
                    labels={graph.labels}
                    title={graph.title}
                    timespans={chartTimespans}
                    defaultTimespan="1M"
                    data={graph.data}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </AnalyticsContainer>
  )
}
