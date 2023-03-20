import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import Back from 'app/components/Back'
import Container from 'app/components/Container'
import Divider from 'app/components/Divider'
import Dots from 'app/components/Dots'
import Empty from 'app/components/Empty'
import FullPositionCard from 'app/components/PositionCard'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import Web3Status from 'app/components/Web3Status'
import { MigrationSupported } from 'app/features/migration'
import { useV2PairsWithLiquidity } from 'app/features/trident/migrate/context/useV2PairsWithLiquidity'
import { useActiveWeb3React } from 'app/services/web3'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Pool() {
  const { i18n } = useLingui()
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()
  const { loading, pairs } = useV2PairsWithLiquidity()

  // @ts-ignore TYPE NEEDS FIXING
  const migrationSupported = chainId in MigrationSupported
  return (
    <div className='w-full maxSx:min-w-[20rem] min-w-[25rem] md:min-w-[28rem]'>
      <Container id="pool-page" className="w-full space-y-6 px-2 pt-10 pb-10 md:pb-20 my-0 mx-auto " maxWidth="2xl">
        <Head>
          <title>Pool | Energyfi</title>
          <meta
            key="description"
            name="description"
            content="EnergyFiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
          />
          <meta
            key="twitter:description"
            name="twitter:description"
            content="EnergyFiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
          />
          <meta
            key="og:description"
            property="og:description"
            content="EnergyFiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
          />
        </Head>

        <div className='m-2 p-6 md:min-w-[40rem] !bg-black/30 rounded border border-Gray maxMd:border-none maxMd:!bg-transparent maxMd:m-0'>
          <div className="mb-3 space-y-3">
            <Back className="ml-3 w-16 maxSm:ml-0" />

            <Typography className='!text-2xl tracking-wide text-white ml-4 maxSm:ml-0 maxMd:mb-3'>
              {i18n._(t`My Liquidity Positions`)}
            </Typography>
          </div>
          <Divider className='border-Gray mb-5 maxMd:hidden' />

          <Alert
            title={i18n._(t`Liquidity Provider Rewards`)}
            message={i18n._(t`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity`)}
            type="information"
            className='mb-4' />

          {!account ? (
            // <Web3Connect className="w-full text-base font-normal text-white !bg-primary rounded-md h-11 maxSm:h-12" />
            <Web3Status web3ConnectClass="w-full text-base font-normal text-white !bg-primary rounded-md h-11 maxSm:h-12" />
          ) : (
            <div className="p-4 space-y-4 rounded-[0.350rem] bg-popupBg/80 overflow-auto hide-scrollbar">
              <div className="grid grid-flow-row gap-3">
                {loading ? (
                  <Empty>
                    <Dots>{i18n._(t`Loading`)}</Dots>
                  </Empty>
                ) : pairs?.length > 0 ? (
                  <>
                    {pairs.map((v2Pair) => (
                      <FullPositionCard
                        key={v2Pair.liquidityToken.address}
                        pair={v2Pair}
                        stakedBalance={CurrencyAmount.fromRawAmount(v2Pair.liquidityToken, '0')}
                      />
                    ))}
                  </>
                ) : (
                  <Empty className="flex text-lg text-center text-white/50">
                    <div className="px-4 py-2">{i18n._(t`No liquidity was found. `)}</div>
                  </Empty>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}