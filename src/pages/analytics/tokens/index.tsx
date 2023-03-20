import Container from 'app/components/Container'
import React from 'react'
import Divider from 'app/components/Divider'
import { BackIcon } from 'app/components/Icon'
import Search from 'app/components/Search'
import Typography from 'app/components/Typography'
import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer'
import Background from 'app/features/analytics/Background'
import useTokensAnalytics from 'app/features/analytics/hooks/useTokensAnalytics'
import TokenList from 'app/features/analytics/Tokens/TokenList'
import useFuse from 'app/hooks/useFuse'
import Link from 'next/link'

export default function Tokens() {
  const tokens = useTokensAnalytics()

  const skipToken = [
    "0x204b3a633c855e9b545f65d00b104ca08a95b522",
    "0x741fa4552a8d38ba504729d8c178bdc35454c8f8",
    "0xeb813611a8b5e2f8559f1a156c20904426de1147",
    "0xcdb5654aa16bf7b19c75145497714eb9557d3a60",
    "0xc01ea20752b35f2105d07ee3eed580a117caabd4",
    "0xa18546d369cb066fd3fdae8f26a77ad26c32a5e4",
  ];

  const FilterTokens = tokens?.filter((item) => {
    const findRes = skipToken.filter((el) => el === item.token.id).length;
    if (!findRes) {
      return item;
    }
  });

  const {
    result: tokensSearched,
    term,
    search,
  } = useFuse({
    data: FilterTokens,
    options: {
      keys: ['token.id', 'token.symbol', 'token.name'],
      threshold: 0.4,
    },
  })

  return (
    <AnalyticsContainer>
      <Container maxWidth="6xl" className="mx-auto w-full h-full">
        <div className='py-10'>
          <Link href="/">
            <BackIcon className='cursor-pointer mt-5 mb-8' />
          </Link>
          <div className="grid items-center justify-between grid-cols-1 gap-y-4 md:grid-cols-06">
            <div className='flex flex-col gap-6 juastify-center'>
              <Typography variant='h1' component='h1' className="!text-3xl !font-bold text-white">
                Tokens
              </Typography>
              <Typography className="!font-normal text-xl text-white">Click on the column name to sort tokens by it&apos;s price or trading volume.</Typography>
            </div>
            <Search term={term} search={search} searchBarCss="!bg-transparent border-Gray flex justify-end w-full" />
          </div>
        </div>
        <Divider className='my-8 border-Gray' />
        <div className="">
          <TokenList tokens={tokensSearched} />
        </div>
      </Container>
    </AnalyticsContainer>
  )
}
