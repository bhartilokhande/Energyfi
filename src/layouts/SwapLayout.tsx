import React, { FC } from "react";

import Container from "../components/Container";
import DefaultLayout from "./Default";
import DoubleGlowShadow from "../components/DoubleGlowShadow";

export interface Layout {
  id: string;
}

export const SwapLayoutCard: FC = ({ children }) => {
  return (
    <div>
      <div className="flex flex-col maxMd:p-3 p-6  rounded-[10px] h-full bg-black/30 border border-Gray">
        {children}
      </div>
    </div>
  );
};

export const Layout: FC<Layout> = ({ children, id }) => {
  return (
    <DefaultLayout>
      <div className="w-full h-full flex items-center">
        <Container
          id={id}
          className="my-0 px-2 pt-10 pb-10 md:pb-20 mx-auto max-w-[40.5rem]"
        >
          <DoubleGlowShadow>{children}</DoubleGlowShadow>
        </Container>
      </div>
    </DefaultLayout>
  );
};

type SwapLayout = (id: string) => FC;
export const SwapLayout: SwapLayout = (id: string) => {
  return (props) => <Layout id={id} {...props} />;
};
