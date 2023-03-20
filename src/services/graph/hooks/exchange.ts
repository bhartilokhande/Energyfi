import { ChainId } from "@sushiswap/core-sdk";
import { useActiveWeb3React } from "app/services/web3";
import stringify from "fast-json-stable-stringify";
import useSWR, { SWRConfiguration } from "swr";

import {
  getAlcxPrice,
  getAvaxPrice,
  getBundle,
  getCeloPrice,
  getCvxPrice,
  getDayData,
  getFactory,
  getFantomPrice,
  getFusePrice,
  getGlimmerPrice,
  getGnoPrice,
  getLiquidityPositions,
  getMagicPrice,
  getMaticPrice,
  getMovrPrice,
  getMphPrice,
  getNativePrice,
  getOhmPrice,
  getOnePrice,
  getPairDayData,
  getPairs,
  getPicklePrice,
  getRulerPrice,
  getSpellPrice,
  getSushiPrice,
  getTokenDayData,
  getTokenPairs,
  getTokens,
  getTruPrice,
  getYggPrice,
  getDevPrice,
} from "../fetchers";
import { GraphProps } from "../interfaces";
import { ethPriceQuery } from "../queries";

export function useFactory({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ["factory", chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getFactory(chainId, variables),
    swrConfig
  );
  return data;
}

export function useNativePrice({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ["nativePrice", chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getNativePrice(chainId, variables),
    swrConfig
  );

  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useEthPrice(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined
) {
  const { data } = useSWR(
    ["ethPrice"],
    () => getNativePrice(variables),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useGnoPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.XDAI;
  const { data } = useSWR(
    shouldFetch ? "gnoPrice" : null,
    () => getGnoPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useGlimmerPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR("glimmerPrice", () => getGlimmerPrice(), swrConfig);
  return data;
}
// @ts-ignore TYPE NEEDS FIXING
export function useDevPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR("devPrice", () => getDevPrice(), swrConfig);
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useSpellPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR("spellPrice", () => getSpellPrice(), swrConfig);
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useOnePrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(["onePrice"], () => getOnePrice(), swrConfig);
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useCeloPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.CELO;
  const { data } = useSWR(
    shouldFetch ? "celoPrice" : null,
    () => getCeloPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useFantomPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.FANTOM;
  const { data } = useSWR(
    shouldFetch ? "fantomPrice" : null,
    () => getFantomPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useMovrPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.MOONRIVER;
  const { data } = useSWR(
    shouldFetch ? "movrPrice" : null,
    () => getMovrPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useYggPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM;
  const { data } = useSWR(
    shouldFetch ? ["yggPrice"] : null,
    () => getYggPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useRulerPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM;
  const { data } = useSWR(
    shouldFetch ? ["rulerPrice"] : null,
    () => getRulerPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useTruPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId && chainId === ChainId.ETHEREUM ? ["truPrice"] : null,
    () => getTruPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useAlcxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM;
  const { data } = useSWR(
    shouldFetch ? ["aclxPrice"] : null,
    () => getAlcxPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useCvxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM;
  const { data } = useSWR(
    shouldFetch ? ["cvxPrice"] : null,
    () => getCvxPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function usePicklePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM;
  const { data } = useSWR(
    shouldFetch ? ["picklePrice"] : null,
    () => getPicklePrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useMphPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM;
  const { data } = useSWR(
    shouldFetch ? ["mphPrice"] : null,
    () => getMphPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useAvaxPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(["avaxPrice"], () => getAvaxPrice(), swrConfig);
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useMaticPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(["maticPrice"], () => getMaticPrice(), swrConfig);
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(["sushiPrice"], () => getSushiPrice(), swrConfig);
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useOhmPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId;
  const { data } = useSWR(
    shouldFetch ? "ohmPrice" : null,
    () => getOhmPrice(chainId),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useFusePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.FUSE;
  const { data } = useSWR(
    shouldFetch ? "fusePrice" : null,
    () => getFusePrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useMagicPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.ARBITRUM;
  const { data } = useSWR(
    shouldFetch ? "magicPrice" : null,
    () => getMagicPrice(),
    swrConfig
  );
  return data;
}

// @ts-ignore TYPE NEEDS FIXING
export function useBundle(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId ? [chainId, ethPriceQuery, stringify(variables)] : null,
    () => getBundle(),
    swrConfig
  );
  return data;
}

export function useLiquidityPositions({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ["liquidityPositions", chainId, stringify(variables)] : null,
    (_, chainId) => getLiquidityPositions(chainId, variables),
    swrConfig
  );
  return data;
}

export function useSushiPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ["sushiPairs", chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getPairs(chainId, variables),
    swrConfig
  );

  const skipPairs = [
    "0x9622377a7acb533a7337ec4b468b592f55037b44",
    "0xac850e32fbec5fe27bfe598759408888caeabbc7",
    "0xe81c2a0a25bffd403dbfe921e2af5c2c44fb32d9",
    "0xf4205386a08c5add5b9639aca22bff770293ea8a",
    "0xfe4a995ad8770b3aaa0cff10381b9c67cf0bc9b2",
    "0xaa35b63af90996cdf4821d0e18db4e5a1c66b11f",
    "0xa27b52a1ec62e35815647a5a598edd51d3e39ec7",
    "0x9096bae813b3e1b991d1874e0080867b31dc3138",
    "0x191c4640c13501ce129d84a26a6d0d91ce89741d",
  ];

  const FilterPairs = data?.filter((item) => {
    const findRes = skipPairs.filter((el) => el === item.id).length;
    if (!findRes) {
      return item;
    }
  });

  return FilterPairs;
}

export function useTokens({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ["tokens", chainId, stringify(variables)] : null,
    (_, chainId) => getTokens(chainId, variables),
    swrConfig
  );
  return data;
}

export function usePairDayData({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch && !!chainId
      ? ["pairDayData", chainId, stringify(variables)]
      : null,
    (_, chainId) => getPairDayData(chainId, variables),
    swrConfig
  );
  return data;
}

export function useTokenDayData(
  { chainId, variables, shouldFetch = true }: GraphProps,
  // @ts-ignore TYPE NEEDS FIXING
  swrConfig: SWRConfiguration = undefined
) {
  const { data } = useSWR(
    shouldFetch && !!chainId
      ? ["tokenDayData", chainId, stringify(variables)]
      : null,
    (_, chainId) => getTokenDayData(chainId, variables),
    swrConfig
  );
  return data;
}

export function useDayData({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch && !!chainId
      ? ["dayData", chainId, stringify(variables)]
      : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getDayData(chainId, variables),
    swrConfig
  );
  return data;
}

export function useTokenPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ["tokenPairs", chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getTokenPairs(chainId, variables),
    swrConfig
  );
  return data;
}
