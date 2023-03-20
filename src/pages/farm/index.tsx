import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Container from 'app/components/Container'
import ExternalLink from 'app/components/ExternalLink'
import Search from 'app/components/Search'
import Typography from 'app/components/Typography'
import { Chef, PairType } from 'app/features/onsen/enum'
import FarmList from 'app/features/onsen/FarmList'
import OnsenFilter from 'app/features/onsen/FarmMenu'
import useFarmRewards from 'app/hooks/useFarmRewards'
import useFuse from 'app/hooks/useFuse'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React from 'react'

export default function Farm(): JSX.Element {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const router = useRouter()
  const type = router.query.filter === null ? 'all' : (router.query.filter as string)

  const FILTER = {
    // @ts-ignore TYPE NEEDS FIXING
    all: (farm) => farm.allocPoint !== '0' && farm.chef !== Chef.OLD_FARMS,
    // @ts-ignore TYPE NEEDS FIXING
    portfolio: (farm) => farm?.amount && !farm.amount.isZero(),
    // @ts-ignore TYPE NEEDS FIXING
    sushi: (farm) => farm.pair.type === PairType.SWAP && farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    kashi: (farm) => farm.pair.type === PairType.KASHI && farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    '2x': (farm) =>
      (farm.chef === Chef.MASTERCHEF_V2 || farm.chef === Chef.MINICHEF) &&
      farm.rewards.length > 1 &&
      farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    old: (farm) => farm.chef === Chef.OLD_FARMS,
  }

  const rewards = useFarmRewards()

  const data = rewards.filter((farm) => {
    // @ts-ignore TYPE NEEDS FIXING
    return type in FILTER ? FILTER[type](farm) : true
  })
  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  return (
    <div className='px-2 pt-10 pb-10 md:pb-20 w-full'>
      <Container maxWidth='5xl' className='bg-black/30 mx-auto p-3 md:p-8 rounded-[0.350rem]'>
        <TridentHeader className="flex flex-col justify-center items-center">
          <div className='flex flex-col justify-center items-center'>
            <Typography variant="h2" className="text-white" weight={700}>
              {i18n._(t`Farming Menu`)}
            </Typography>
            <Typography variant="sm" weight={400} className="text-white">
              {i18n._(t`Earn fees and rewards by depositing and staking your tokens to the platform.`)}
            </Typography>
          </div>
        </TridentHeader>
        <TridentBody>
          <div className="flex flex-col w-full gap-6 mt-3 md:mt-5">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
              <Search search={search} term={term} searchBarCss="border-Gray !bg-ternary" />
              <OnsenFilter />
            </div>
            <FarmList farms={result} term={term} />
            {chainId && chainId === ChainId.CELO && (
              <Typography variant="xs" weight={700} className="text-secondary italic text-center">
                {i18n._(t`Users can now bridge back to Celo using a new version of Optics.`)}{' '}
                <ExternalLink
                  color="primary"
                  id={`celo-optics-info-link`}
                  href="#"
                >
                  {i18n._(t`Click for more info on Optics V1 Migration.`)}
                </ExternalLink>
              </Typography>
            )}
          </div>
        </TridentBody>
      </Container>
    </div>
  )
}
