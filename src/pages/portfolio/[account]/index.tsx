import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ActionsModal from 'app/features/portfolio/ActionsModal'
import { BentoBalances, WalletBalances } from 'app/features/portfolio/AssetBalances/bentoAndWallet'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'app/features/portfolio/useAccountInUrl'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Head from 'next/head'
import React from 'react'

const Portfolio = () => {
  const { i18n } = useLingui()

  const account = useAccountInUrl('/')

  if (!account) return null

  return (
    <>
      <Head>
        <title>{i18n._(t`Portfolio`)} | Energyfi</title>
        <meta
          key="description"
          name="description"
          content="Get a summary of all of the balances in your portfolio on Energyfi."
        />
      </Head>
      <div className='w-full bg-MobileBanner md:bg-Banner !bg-cover bg-center bg-no-repeat p-5'>
        <TridentHeader>
          <HeaderDropdown account={account} />
        </TridentHeader>
        <TridentBody className="flex flex-col grid-cols-2 gap-10 lg:grid lg:gap-4 mt-5">
          <WalletBalances account={account} />
        </TridentBody>
        <ActionsModal />
      </div>
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio
