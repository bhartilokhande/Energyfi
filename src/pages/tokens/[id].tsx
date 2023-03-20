import Container from 'app/components/Container'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Token() {
  const router = useRouter()
  const { id } = router.query
  return (
    <Container id={`token-${id}-page`} className="px-2 pt-10 pb-10 md:pb-20 mx-auto" maxWidth="2xl">
      <Head>
        <title>Token {id} | Energyfi</title>
        <meta key="description" name="description" content="EnergyFiSwap tokens." />
        <meta key="twitter:description" name="twitter:description" content="EnergyFiSwap tokens." />
        <meta key="og:description" property="og:description" content="EnergyFiSwap tokens." />
      </Head>
    </Container>
  )
}
