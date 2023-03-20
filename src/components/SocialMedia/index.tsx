import { classNames } from "app/functions"
import React from "react"
import { TwitterIcon, Meduim2Icon, TelegramIcon, CoinGeckoIcon, CoinmarketcapIcon } from "../Icon"

interface SocialMediaProps {
    className?: string
    socialMediaCss?: string
}


export const SocialMedia: React.FC<SocialMediaProps> = ({
    className,
    socialMediaCss
}) => {
    return (
        <div className={className}>
            <div className={classNames("flex items-center gap-6", socialMediaCss)}>
                <a href="https://twitter.com/Energyfi_io">
                    <TwitterIcon width={28} className="text-white cursor-pointer" />
                </a>
                <a href="https://energyfi.medium.com/" >
                    <Meduim2Icon width={28} className="text-white cursor-pointer" />
                </a>
                <a href="https://telegram.me/Energyfi_official">
                    <TelegramIcon width={28} className="!text-white cursor-pointer" />
                </a>
                <a href="https://www.coingecko.com/en/coins/energyfi" >
                    <CoinGeckoIcon width={28} className="text-white cursor-pointer" />
                </a>
                <a href="https://coinmarketcap.com/currencies/energyfi/" >
                    <CoinmarketcapIcon width={28} className="text-white cursor-pointer" />
                </a>
            </div>
        </div>
    )
}