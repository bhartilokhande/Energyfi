import Head from 'next/head'

import Container from '../../components/Container'
export default function Settings() {
  return (
    <Container id="settings-page" className="py-4 space-y-3 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Settings | Energyfi</title>
        <meta name="description" content="EnergyFiSwap Settings..." />
        <meta key="twitter:description" name="twitter:description" content="EnergyFiSwap Settings..." />
        <meta key="og:description" property="og:description" content="EnergyFiSwap Settings..." />
      </Head>
    </Container>
  )
}
