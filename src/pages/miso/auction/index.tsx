import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/react'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import AuctionCreationWizard from 'app/features/miso/AuctionCreationWizard'
import NetworkGuard from 'app/guards/Network'
import MisoLayout, { MisoBody, MisoHeader } from 'app/layouts/Miso'
import Link from 'next/link'
import React, { Fragment } from 'react'

const Auction = () => {
  const { i18n } = useLingui()

  const link = (
    <a href="https://instantmiso.gitbook.io/miso/" target="_blank" rel="noreferrer" className="text-blue">
      here
    </a>
  )

  return (
    <>
      <MisoHeader className="bg-miso-bowl bg-cover">
        <div className="flex flex-col gap-4">
          <div>
            <Button
              variant='filled' color="btn_primary" className="w-full h-10 rounded-[0.350rem]"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={`/miso`}>{i18n._(t`All Auctions`)}</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {i18n._(t`New Auction`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              <Trans
                id="Choose which type of auction you’d like to hold.  Each of the three types has their own unique characteristics, so choose the one you think is most appropriate for your project.  Need more information on what these mean, and which is best for you? Read our documentation {link}."
                values={{ link }}
                components={Fragment}
              />
            </Typography>
          </div>
        </div>
      </MisoHeader>
      <MisoBody>
        <AuctionCreationWizard />
      </MisoBody>
    </>
  )
}

Auction.Layout = MisoLayout
Auction.Guard = NetworkGuard(Feature.MISO)

export default Auction
