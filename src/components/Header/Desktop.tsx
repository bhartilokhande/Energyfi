import { NATIVE } from '@sushiswap/core-sdk'
import Container from 'app/components/Container'
import useMenu from 'app/components/Header/useMenu'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Link from 'next/link'
import router from 'next/router'
import React, { FC } from 'react'
import { EnergyFiLogo } from '../Icon'
import energyfiLogo from '../../../public/images/EnergyfiLogo.svg'
import { NavigationItem } from './NavigationItem'

const HEADER_HEIGHT = 71

const Desktop: FC = () => {
  const menu = useMenu()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const isCoinbaseWallet = useIsCoinbaseWallet()

  return (
    <>
      <header className="fixed z-20 hidden w-full lg:block bg-[#191919] ">
        <nav>
          <Container maxWidth="6xl" className="mx-auto">
            <div className="flex gap-6 px-0 bg-[#191919] w-full justify-between">
              <div className="flex items-center mr-4">
                {/* <EnergyFiLogo
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/`)
                  }}
                /> */}
                <img
                  className='max-w-[158px] cursor-pointer'
                  src={energyfiLogo.src}
                  alt="energyfiLogo"
                  onClick={() => {
                    router.push(`/`)
                  }}
                />
              </div>
              <div className="flex gap-4 !items-center">
                {menu.map((node) => {
                  return <NavigationItem node={node} key={node.key} />
                })}
                <div className="flex items-center justify-end gap-3">
                  <div className="hidden sm:inline-block">
                    <Web3Network  popoverCss= "max-w-[13rem]"/>
                  </div>
                  <div className='flex w-full items-center border border-primary h-10 rounded-[0.350rem]'>
                    <div>
                      {account && chainId && userEthBalance && (
                        <Link href={`/portfolio/${account}`} passHref={true}>
                          <a className="px-3 text-high-emphesis text-bold">
                            {/*@ts-ignore*/}
                            {userEthBalance?.toSignificant(4)}
                            <span className='text-Indigo ml-1.5'>
                              {NATIVE[chainId || 1].symbol}
                            </span>
                          </a>
                        </Link>
                      )}
                    </div>
                    <Web3Status web3ConnectClass="bg-primary hover:bg-primary/90 hover:text-white/90 font-normal text-white rounded-[0.350rem] w-[9rem] !h-[2.5rem]" />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </nav>
      </header>
      <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

export default Desktop