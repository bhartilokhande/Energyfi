import Container from 'app/components/Container'
import Divider from 'app/components/Divider'
import { BackIcon } from 'app/components/Icon'
import Search from 'app/components/Search'
import Typography from 'app/components/Typography'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import FarmList from 'app/features/analytics/Farms/FarmList'
import useFarmRewards from 'app/hooks/useFarmRewards'
import useFuse from 'app/hooks/useFuse'
import router from 'next/router'
import { useMemo } from 'react'

export default function Farms(): JSX.Element {
  const farms = useFarmRewards()

  const farmsFormatted = useMemo(
    () =>
      farms
        ?.map((farm) => ({
          pair: {
            token0: farm.pair.token0,
            token1: farm.pair.token1,
            id: farm.pair.id,
            name: farm.pair.symbol ?? `${farm.pair.token0.symbol}-${farm.pair.token1.symbol}`,
            type: farm.pair.symbol ? 'Kashi Farm' : 'Energyfi Farm',
          },
          rewards: farm.rewards,
          liquidity: farm.tvl,
          apr: {
            daily: farm.roiPerDay * 100,
            monthly: farm.roiPerMonth * 100,
            annual: farm.roiPerYear * 100,
          },
        }))
        .filter((farm) => (farm ? true : false)),
    [farms]
  )

  const options = useMemo(
    () => ({
      keys: ['pair.token0.symbol', 'pair.token1.symbol'],
      threshold: 0.4,
    }),
    []
  )

  const {
    result: farmsSearched,
    term,
    search,
  } = useFuse({
    data: farmsFormatted,
    options,
  })

  return (
    <AnalyticsContainer>
      <Container maxWidth="6xl" className="mx-auto w-full h-full">
        <div className='py-10'>
          <BackIcon onClick={() => router.back()} className='cursor-pointer mt-5 mb-8' />
          <div className="grid items-center justify-between grid-cols-1 gap-y-4 md:grid-cols-06">
            <div className='flex flex-col gap-6 juastify-center'>
              <Typography variant='h1' component='h1' className="!text-3xl !font-bold text-white">
                Farms
              </Typography>
              <Typography className="!font-normal text-xl text-white">Farms are incentivized pools. Click on the column name to sort by APR or volume.</Typography>
            </div>
            <Search term={term} search={search} searchBarCss="!bg-transparent border-Gray flex justify-end w-full" />
          </div>
        </div>
        <Divider className='my-8 border-Gray' />
        <div className="">
          <FarmList pools={farmsSearched} />
        </div>
      </Container>
    </AnalyticsContainer>
  )
}
