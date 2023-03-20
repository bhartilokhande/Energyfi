import React from 'react'
import { CoinGeckoIcon, CoinmarketcapIcon, DiscordIcon, MediumIcon, Meduim2Icon, TelegramIcon, TwitterIcon } from 'app/components/Icon'
import { classNames } from 'app/functions'

interface FooterIconsProps {
    footerIconsCss?: string
}

const FooterIcons: React.FC<FooterIconsProps> = ({ footerIconsCss }) => {
    return (
        <div className={classNames("flex items-center gap-6", footerIconsCss)}>
            <div className="flex items-center justify-around w-full max-w-[15rem]">
                <a href="https://twitter.com/Energyfi_io">
                    <TwitterIcon className="text-white cursor-pointer w-[33px]" />
                </a>
                <a href="https://energyfi.medium.com/" >
                    <Meduim2Icon className="text-white cursor-pointer w-[33px]" />
                </a>
                <a href="https://telegram.me/Energyfi_official">
                    <TelegramIcon  className="!text-white cursor-pointer w-[33px]" />
                </a>
                <a href="https://www.coingecko.com/en/coins/energyfi" >
                    <CoinGeckoIcon  className="text-white cursor-pointer w-[33px]" />
                </a>
                <a href="https://coinmarketcap.com/currencies/energyfi/" >
                    <CoinmarketcapIcon  className="text-white cursor-pointer w-[29px]" />
                </a>
            </div>
        </div>
    )
}

export default FooterIcons