import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { SUSHI_ADDRESS } from '@sushiswap/core-sdk'
import { BrowseIcon, AddIcon, ImportIcon } from '../../components/Icon'
import { Feature } from '../../enums'
import { featureEnabled } from '../../functions'
import { useActiveWeb3React } from '../../services/web3'
import { ReactNode, useMemo } from 'react'
import React from 'react'
export interface MenuItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}
export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  icon?: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    let dashboardMenu: MenuItem = {
      key: 'dashboard',
      title: i18n._(t`Dashboard`),
      link: '/'
    }

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Swap`),
      link: '/swap',
    }

    let bridgeMenu: MenuItem = {
      key: 'bridge',
      title: i18n._(t`Bridge`),
      link: 'https://energyfi.app/bridge/',
    }

    const poolMenu = [
      {
        key: 'browse',
        title: i18n._(t`Browse`),
        link: '/pool',
        icon: <BrowseIcon />
      },
      {
        key: 'add-liquidity',
        title: i18n._(t`Add`),
        link: `/add/ETH/${SUSHI_ADDRESS[chainId]}`,
        icon: <AddIcon />
      },
      {
        key: 'import',
        title: i18n._(t`Import`),
        link: '/find',
        icon: <ImportIcon />
      },
    ]

    const mainItems: Menu = [dashboardMenu, tradeMenu]

    if (poolMenu.length > 0)
      mainItems.push({
        key: 'pool',
        title: i18n._(t`Pool`),
        items: poolMenu,
      })

    //if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
    const farmItems = {
      key: 'farm',
      title: i18n._(t`Farm`),
      items: [
        {
          key: 'your-farms',
          title: i18n._(t`Your Farms`),
          link: '/farm?filter=portfolio',
        },
        {
          key: 'all-farms',
          title: i18n._(t`All Farms`),
          link: '/farm',
        },
      ],
    }
    mainItems.push(farmItems)
    // }
    mainItems.push(bridgeMenu)

    let stakeMenu: MenuItem = {
      key: 'stake',
      title: i18n._(t`Stake`),
      link: '/stake',
    }
    mainItems.push(stakeMenu)


    // if (featureEnabled(Feature.MISO, chainId)) {
    const launchpad = {
      key: 'launchpad',
      title: i18n._(t`Launchpad`),
      link: 'https://energyfi.app/launchpad',
    }
    mainItems.push(launchpad)
    // }

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [account, chainId, i18n])
}

export default useMenu
