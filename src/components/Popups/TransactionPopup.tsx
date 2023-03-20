import { ExternalLinkIcon } from '@heroicons/react/outline'
import { getExplorerLink } from 'app/functions/explorer'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'

import ExternalLink from '../ExternalLink'

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  return (
    <div className="flex flex-row w-full flex-nowrap z-[1000]">
      <div className="pr-4">
        {success ? <CheckCircle className="text-2xl text-green" /> : <AlertCircle className="text-2xl text-red" />}
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-bold text-high-emphesis">
          {summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </div>
      </div>
    </div>
  )
}
