import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import Web3 from "web3";
import { ChainId } from '@sushiswap/core-sdk'
import { classNames } from 'app/functions'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'
import { Activity } from 'react-feather'

import Button, { ButtonProps } from '../Button'

export default function Web3Connect({ color = 'gray', size = 'sm', className = '', ...rest }: ButtonProps) {
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const { error } = useWeb3React()
  const web3 = new Web3(Web3.givenProvider || window?.ethereum);
  // const { chainId } = useActiveWeb3React()

  const chainId = ChainId.MOONBEAM;
  const RPC_URLS = 'https://rpc.api.moonbeam.network';

  const handleConnect = async () => {
    // if (!Web3.givenProvider && !window.ethereum) {
    //   return window.open('https://metamask.app.link/dapp/test.energyfi.app/');
    // }
    if (window?.ethereum?.networkVersion !== chainId) {
      try {
        await window?.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(chainId) }],
        });
        toggleWalletModal();
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (err.code === 4902 || err.code === -32603) {
          await window?.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: `Moonbase ${chainId === 1284 ? 'Testnet' : 'Mainnet'}`,
                chainId: web3.utils.toHex(chainId),
                nativeCurrency: { name: "DEV", decimals: 18, symbol: "DEV" },
                rpcUrls: [RPC_URLS],
                blockExplorerUrls: [`https://${chainId === 1284 ? 'moonbeam' : ''}.moonscan.io/`],
              },
            ],
          });
          toggleWalletModal();
        }
        else {
          toggleWalletModal();
        }
      }
    }
    else {
      toggleWalletModal();
    }
  }
  return error ? (
    <div
      onClick={handleConnect}
    >
      <div className="mr-1">
        <Activity className="w-4 h-4" />
      </div>
      {error instanceof UnsupportedChainIdError ? i18n._(t`You are on the wrong network`) : i18n._(t`Error`)}
    </div>
  ) : (
    <Button
      id="connect-wallet"
      onClick={handleConnect}
      variant="outlined"
      color={color}
      className={classNames(className, '!border-none')}
      size={size}
      {...rest}
    >
      {i18n._(t`Connect Wallet`)}
    </Button>
  )
}
