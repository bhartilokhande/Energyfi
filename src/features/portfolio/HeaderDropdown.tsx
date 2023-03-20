import Davatar from '@davatar/react'
import { LinkIcon } from '@heroicons/react/outline'
import CopyHelper from 'app/components/AccountDetails/Copy'
import Typography from 'app/components/Typography'
import { BalancesSum } from 'app/features/portfolio/BalancesSum'
import { getExplorerLink, shortenAddress } from 'app/functions'
import useENSName from 'app/hooks/useENSName'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import Identicon from 'react-blockies'

interface HeaderDropdownProps {
  hideAccount?: boolean
  account: string
}

const HeaderDropdown: FC<HeaderDropdownProps> = ({ account, hideAccount = false }) => {
  const { library, chainId } = useActiveWeb3React()
  const [show, setShow] = useState<boolean>(false)
  const { ENSName } = useENSName(account ?? undefined)

  return (
    <div className='flex gap-3 maxMd:flex-col w-full'>
      <div className="flex items-center gap-5" onClick={() => setShow(!show)}>
        {account && (
          <div className="border-2 rounded-full">
            <Davatar
              size={64}
              address={account}
              defaultComponent={<Identicon seed={account} size={12} className="rounded-full" />}
              provider={library}
            />
          </div>
        )}
        <div className="flex flex-col">
          {account && (
            <Link href={getExplorerLink(chainId, account, 'address')} passHref={true}>
              <a target="_blank">
                <Typography
                  variant="h3"
                  className="text-Green flex gap-1 cursor-pointer maxSx:text-lg"
                  weight={700}
                >
                  {ENSName ? ENSName : account ? shortenAddress(account) : ''} <LinkIcon width={20} />
                </Typography>
              </a>
            </Link>
          )}
          {account && !hideAccount && (
            <CopyHelper toCopy={account} className="mt-2 maxSx:text-sm text-white bg-primary/50 rounded-full flex items-cemter justify-center h-[1.8rem]">
              {shortenAddress(account)}
            </CopyHelper>
          )}
        </div>
      </div>
      <BalancesSum account={account} />
    </div>
  )
}

export default HeaderDropdown
