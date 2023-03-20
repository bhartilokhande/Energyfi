import { Dialog, Transition } from '@headlessui/react'
import { MenuIcon } from '@heroicons/react/outline'
import { NATIVE } from '@sushiswap/core-sdk'
import useMenu from 'app/components/Header/useMenu'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Link from 'next/link'
import router from 'next/router'
import React, { FC, Fragment, useState } from 'react'
import Divider from '../Divider'
import { ELogo } from '../Icon'

import { NavigationItem } from './NavigationItem'

interface MobileProps {
  popoverCss?: string
}

const Mobile: FC<MobileProps> = ({ popoverCss }) => {
  const menu = useMenu()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)
  const isCoinbaseWallet = useIsCoinbaseWallet()

  return (
    <>
      <header className="w-full flex items-center justify-between min-h-[64px] h-[64px] px-4 bg-[#191919]">
        <div className="flex flex-grow justify-between items-center">
          <div className="">
            <MenuIcon strokeWidth={1} width={28} className="hover:text-white text-white/70 cursor-pointer" onClick={() => setOpen(true)} />
          </div>
          <div className="flex mr-1 items-center">
              <ELogo
                width={35}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/`)
                }} />
          </div>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 overflow-hidden z-20" onClose={setOpen}>
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="absolute inset-0 bg-field top-12 bg-opacity-80 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-y-0 left-0 pr-10 flex top-12 max-w-xs md:max-w-lg">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-[-100%]"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-[-100%]"
                >

                  <div className="!w-[30rem] max-w-md bg-[#191919] overflow-y-auto hide-scrollbar">
                    <div className="flex flex-col mt-0.5 pb-6 overflow-x-hidden">
                      <nav className="flex-1 pl-6" aria-label="Sidebar">
                        {menu.map((node) => {
                          return <NavigationItem node={node} key={node.key} onClose={() => setOpen(false)} />
                        })}
                      </nav>
                      <Divider className='border-Gray' />
                      <div className='flex flex-col justify-center gap-4 mx-3 mt-3'>
                        <div className="w-full">
                          <Web3Network popoverCss="!relative" />
                        </div>
                        <div className="flex items-center justify-start gap-2">
                          <div className='flex w-full items-center border border-primary h-10 rounded-[0.350rem] justify-center'>
                            {account && chainId && userEthBalance && (
                              <Link href="/portfolio" passHref={true}>
                                <a className="hidden px-3 text-high-emphesis text-bold md:block">
                                  {/*@ts-ignore*/}
                                  {userEthBalance?.toSignificant(4)} {NATIVE[chainId || 1].symbol}
                                </a>
                              </Link>
                            )}
                            {
                              <Web3Status web3ConnectClass="bg-primary hover:bg-primary/90 hover:text-white/90 font-normal text-white rounded-[0.350rem] w-full !h-[2.5rem]" />
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </header>
    </>
  )
}
export default Mobile