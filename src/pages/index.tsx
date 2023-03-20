import Container from "../components/Container";
import Head from "next/head";

import Home from "../pages/analytics/dashboard";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Energyfi | Dashboard</title>
        <meta name="description" content="Energyfi" />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="Energyfi"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Energyfi"
        />
      </Head>
      <Home />
    </>
  );
}
