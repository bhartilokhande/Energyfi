import React, { FC } from "react";
import router from "next/router";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import Container from "../Container";
import Button from "../Button";
import Typography from "../Typography";
//@ts-ignore
import circleImg from "../../../public/images/circleIcon.svg";
//@ts-ignore
import ellipseImg from "../../../public/images/ellipseIcon.svg";
//@ts-ignore
import carveImg from "../../../public/images/uTurn.svg";
//@ts-ignore
import downArrow from "../../../public/images/downArrow.svg";
import Link from "next/link";

interface IntroSectionProps {
  Heading?: string;
  path1?: string;
  path2?: string;
  btnName1?: string;
  btnName2?: string;
  link?: string;
  scrollText?: string;
  handleScroll?: any;
}

export const IntroSection: FC<IntroSectionProps> = ({
  Heading,
  path1,
  path2,
  btnName1,
  btnName2,
  link,
  scrollText,
  handleScroll,
}) => {
  const { i18n } = useLingui();

  return (
    <div>
      {/* <Container maxWidth="6xl" className="mx-auto  h-full w-full relative">
        <div className="h-[540px] md:h-[630px] flex items-center relative">
          <div className="flex flex-col bg-blackShadow bg-2x1002 md:bg-2x100 bg-no-repeat bg-center h-full max-h-[479px] px-3 md:p-5 justify-center relative max-w-[540px] maxMd:gap-3">
            <div className="flex flex-col maxLg:pt-1 gap-7 maxLg:gap-1 w-full  max-w-[90%]">
              <Typography className="!font-semibold tracking-wide md:!leading-[3.5rem] !leading-[2rem] !text-xl md:!text-[2.5rem] maxLg:mb-0 maxMd:text-[1.7rem] text-white">
                {Heading}
              </Typography>
            </div>
            <div className="flex gap-2 md:gap-5 w-full md:max-w-sm max-w-[14rem] md:mt-3">
              <Button
                fullWidth
                color="btnSecondary"
                className="w-full text-sm md:text-base font-bold text-white rounded-[0.350rem] h-10 md:h-12"
                onClick={() => {
                  router.push(`${path1}`);
                }}
              >
                {i18n._(t`${btnName1}`)}
              </Button>
              <Button
                fullWidth
                color="btn_primary"
                className="w-full text-sm md:text-base font-bold text-white rounded-[0.350rem] h-10 md:h-12"
                onClick={() => {
                  path2 ? router.push(`${path2}`) : undefined;
                }}
              >
                <a href={link} target="_blank">
                  {i18n._(t`${btnName2}`)}
                </a>
              </Button>
            </div>
            <div className="arrow_icon ">
              <img
                src={uTurn.src}
                alt=""
                className="w-[4rem] h-[4rem] md:w-[7rem] md:h-[7rem] absolute bottom-36 md:bottom-12 hover:rotate-3"
              />
            </div>
          </div>
          <img
            src={circleImg.src}
            alt=""
            className="w-[9rem] md:w-[18rem] md:h-[297px] h-[165px] absolute -top-[5px] md:top-[10px] md:right-[24%]"
          />
          <img
            src={ellipseImg.src}
            alt=""
            className="w-[10.5rem] md:w-[21rem] md:h-[357px] h-[160px] absolute md:bottom-0 -bottom-[2rem] right-0"
          />
        </div>
      </Container>
      <button
        className="flex justify-center items-center h-10 flex-col gap-3 mb-5"
        onClick={() => handleScroll()}
      >
        <Typography variant="h3" component="h4" className="text-white text-[1rem]">
          {scrollText}
        </Typography>
        <div className="border border-white/10 px-1 py-2 rounded-full scroll_btn ">
          <img src={downArrow.src} alt="" className="w-5 h-5" />
        </div>
      </button> */}
      <div className="intro_section hide-scrollbar">
        <div className="container">
          <div className="intro_left">
            <h1> {Heading}</h1>
            <div className="intro_btn">
              <button
                type="button"
                className="launch_btn"
                onClick={() => {
                  router.push(`${path1}`);
                }}
              >
                {btnName1}
              </button>
              <a href={link} target="_blank">
                <button type="button" className="buy_btn">
                  {btnName2}
                </button>
              </a>
            </div>
            <img src={carveImg.src} className="curve_img" alt="curve" />
          </div>

          <div className="intro_right">
            <div className="intro_circle">
              <img src={circleImg.src} alt="circle" />
            </div>

            <div className="intro_ellipse">
              <img src={ellipseImg.src} alt="ellipse" />
            </div>
          </div>
          <div className="analytic_para" onClick={() => handleScroll()}>
            <p>
              {scrollText}
              <img src={downArrow.src} alt="down arrow" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
