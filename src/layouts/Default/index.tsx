import React, { FC } from "react";
import { useLocation } from "react-use";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { IntroSection } from "../../components/IntroSections/IntroSection";
import Main from "../../components/Main";
import Popups from "../../components/Popups";
import useDesktopMediaQuery from "../../hooks/useDesktopMediaQuery";

const Layout = ({ children }) => {
  const location = useLocation();
  const pathName = location.pathname;
  const isDesktop = useDesktopMediaQuery();

  const handleScroll = () => {
    var scrollDiv = document.getElementById("scroll-down")?.offsetTop;
    window.scrollTo({ top: scrollDiv, behavior: "smooth" });
  };
  const HeroIntro = () => {
    return (
      <>
        {pathName === "/swap" ? (
          <div className="bg-MobileBannerTop md:bg-intro bg-no-repeat w-full bg-cover">
            <IntroSection
              Heading={`${
                isDesktop
                  ? "Start investing on Energyfi swap"
                  : "Start trading on Energyfi swap"
              }`}
              path1="/"
              link="https://docs.energyfi.io/ecosystem/swap"
              btnName1="Dashboard"
              btnName2="Swap Tutorial"
              scrollText="Start trading"
              handleScroll={handleScroll}
            />
          </div>
        ) : pathName === "/farm" ? (
          <div className="bg-MobileBannerTop md:bg-intro bg-no-repeat w-full bg-cover">
            <IntroSection
              Heading="Start farming and get the best APR"
              path1="/"
              link="https://docs.energyfi.io/tutorials/how-to-farm-on-energyfi"
              btnName1="Dashboard"
              btnName2="Farming Tutorial"
              scrollText="Start farming"
              handleScroll={handleScroll}
            />
          </div>
        ) : pathName === "/stake" ? (
          <div className="bg-MobileBannerTop md:bg-intro bg-no-repeat w-full bg-cover">
            <IntroSection
              Heading="Stake EFT and earn a part of the swap fees"
              path1="/"
              link="https://docs.energyfi.io/ecosystem/staking-farming"
              btnName1="Dashboard"
              btnName2="Staking Tutorial"
              scrollText="Start staking"
              handleScroll={handleScroll}
            />
          </div>
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <HeroIntro />
      <div
        id="scroll-down"
        className="flex flex-col items-center w-full bg-MobileBanner md:bg-Banner bg-bottom !bg-cover bg-center bg-no-repeat"
      >
        <Main>{children}</Main>
        <Popups />
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
