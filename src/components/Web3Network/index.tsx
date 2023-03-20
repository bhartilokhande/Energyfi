import { NETWORK_ICON, NETWORK_LABEL, } from '../../config/networks'
import NetworkModel from '../../modals/NetworkModal'
import { useActiveWeb3React } from '../../services/web3'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import Image from 'next/image'
import React, { FC, useRef } from 'react'
import Typography from '../../components/Typography'
import { ChainId } from '@sushiswap/core-sdk'
import { ChevronDownIcon } from '../Icon'
import { useClickAway } from 'react-use'
import { ApplicationModal } from '../../state/application/actions'

interface Web3NetworkProps {
  popoverCss?: string
}
const Web3Network: FC<Web3NetworkProps> = ({ popoverCss }) => {
  const { chainId } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)

  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  const modalRef = useRef(null)
  useClickAway(modalRef, () => {
    networkModalOpen && toggleNetworkModal()
  })
  return (
    <div
      ref={modalRef}
      className="flex lg:w-[11rem] items-center rounded-[0.350rem] border border-primary font-bold py-1 px-2 h-10"
      onClick={() => toggleNetworkModal()}
    >
      <div className="grid items-center grid-flow-col items-center justify-center  w-full text-sm rounded-[0.350rem]">
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-md" width="22px" height="22px" />
        <div className='ml-2.5'>
          <Typography weight={700} className="text-high-emphesis">
            {NETWORK_LABEL[chainId as ChainId]}
          </Typography>
        </div>
        <ChevronDownIcon width={15} className='ml-3 text-white' />
        <NetworkModel popoverCss={popoverCss} />
      </div>
    </div>
  )
}
export default Web3Network