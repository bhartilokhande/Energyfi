import React, { FC, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import router from 'next/router'
// import { Chainsulting, EnergyFiLogo } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import Container from '../Container'
import Divider from '../Divider'
import FooterIcons from './FooterIcons'
import Button from '../Button'
import energyfiLogo from '../../../public/images/EnergyfiLogo.svg';
import { SFIcon } from '../Icon'

const Footer = () => {
  const { i18n } = useLingui()
  const path = window.location.pathname
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setEmail(value)
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log('email', email)
    setEmail('')
  }

  return (
    <>
      <div className="bg-[#191919] z-10 w-full flex flex-col items-center md:h-[430px]">
        <Container maxWidth="6xl" className="mx-auto p-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5 md:gap-3">
            <div className='w-full max-w-sm md:max-w-xs'>
              {/* <EnergyFiLogo className='-ml-2 mb-3 mt-2 md:w-48 w-32  h-auto cursor-pointer'
              onClick={() => {
                router.push(`/`)
              }}
            /> */}
              <div className='md:w-48 w-[9.5rem] maxMd:h-[6rem] '>
                <img
                  src={energyfiLogo.src}
                  alt="energyfiLogo"
                  className='cursor-pointer maxMd:h-[5rem]'
                  onClick={() => {
                    router.push(`/`)
                  }}
                />
              </div>

              <Typography variant="sm" className=" text-white/80 leading-[1.5rem]">
                {i18n._(t`Energyfi is designing green and cost-effective Decentralized Finance by providing a complete set of DeFi features on Moonbeam, Avax, Near, Bsc and Echain (Energyfi Chain) all while accelerating their adoption.  `)}
              </Typography>
              <FooterIcons footerIconsCss="mt-4 md:-ml-3" />
            </div>
            <div className='flex items-end'>
              <div className='grid md:grid-cols-04 grid-cols-1 border-y pb-8 pt-8 w-full mt-[0.7rem] md:mt-[3.7rem]'>
                <div>
                  <Typography variant='lg' className="font-black text-white">
                    {i18n._(t`Stay Informed`)}
                  </Typography>
                  <Typography variant='sm' className='text-white/80 pt-1'>
                    {i18n._(t`Subscribe to our newsletter.`)}
                  </Typography>
                </div>
                <div className='justify-center flex flex-col gap-1 w-full pt-8'>
                  <form onSubmit={handleSubmit} className='w-full indent-3 bg-transparent'>
                    <input
                      name="email_address"
                      placeholder="Your Email"
                      required
                      type="email"
                      onChange={handleEmailChange}
                      value={email}
                      className="bg-transparent placeholder-Gray-500 h-6 mt-1"
                    />
                    <Divider className='border-Gray mb-3 mt-1' />
                    <Button
                      variant='filled'
                      color='btn_primary'
                      className='!font-normal !h-10 rounded-[0.350rem] w-full'
                    >
                      {i18n._(t`Subscribe`)}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex md:justify-between maxMd:flex-col maxMd:justify-around items-center md:pt-5 maxMd:h-[6rem] maxMd:my-[1rem]'>
            <Typography variant='sm' className="!font-light	 text-white">
              {i18n._(t`contact@energyfi.io`)}
            </Typography>
            <Typography variant='sm' className="!font-light text-white">
              {i18n._(t`© 2022 by Energyfi`)}
            </Typography>
          </div>
        </Container>
      </div>
      <div className='justify-center items-center flex w-full bg-[#202020] py-4 maxMd:py-5'>
        <Typography variant="sm" className="text-white mr-2.5 hover:text-high-emphesis">
          {i18n._(t`Audited by:`)}
        </Typography>
        <SFIcon height={31} className="mr-[0.6rem]" />
        {/* <Chainsulting width={125} height={50} /> */}
      </div>
    </>
  )
}
export default Footer
