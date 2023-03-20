import React, { useCallback, useEffect, useState } from 'react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Currency,
  CurrencyAmount,
  JSBI,
  NATIVE,
  Token,
} from '@sushiswap/core-sdk';
import Alert from 'app/components/Alert';
import Button from 'app/components/Button';
import { AutoColumn } from 'app/components/Column';
import Container from 'app/components/Container';
import CurrencySelectPanel from 'app/components/CurrencySelectPanel';
import Dots from 'app/components/Dots';
import { MinimalPositionCard } from 'app/components/PositionCard';
import Typography from 'app/components/Typography';
import Web3Connect from 'app/components/Web3Connect';
import Web3Status from 'app/components/Web3Status';
import { currencyId } from 'app/functions/currency';
import { PairState, useV2Pair } from 'app/hooks/useV2Pairs';
import { useActiveWeb3React } from 'app/services/web3';
import { usePairAdder } from 'app/state/user/hooks';
import { useTokenBalance } from 'app/state/wallet/hooks';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Plus } from 'react-feather';
import Divider from 'app/components/Divider';
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery';

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { i18n } = useLingui();
  const { account, chainId } = useActiveWeb3React();
  const router = useRouter();

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);
  // @ts-ignore TYPE NEEDS FIXING
  const [currency0, setCurrency0] = useState<Currency | null>(() =>
    chainId ? NATIVE[chainId] : null
  );
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = useV2Pair(
    currency0 ?? undefined,
    currency1 ?? undefined
  );

  const addPair = usePairAdder();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.quotient, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.quotient, JSBI.BigInt(0))
    );

  const position: CurrencyAmount<Token> | undefined = useTokenBalance(
    account ?? undefined,
    pair?.liquidityToken
  );

  const hasPosition = Boolean(
    position && JSBI.greaterThan(position.quotient, JSBI.BigInt(0))
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField]
  );

  const prerequisiteMessage = (
    <div className="!p-5 mx-3 md:mx-6 text-center rounded-[0.350rem] bg-ternary/30">
      {i18n._(t`Select a token to find your liquidity`)}
    </div>
  );

  const isDesktop = useDesktopMediaQuery();

  return (
    <div className="w-full min-h-screen">
      <Container
        id="find-pool-page"
        className="space-y-6 px-2 pt-10 pb-10 md:pb-20 my-0 mx-auto"
        maxWidth="2xl"
      >
        <Head>
          <title>{i18n._(t`Find Pool`)} | Energyfi</title>
          <meta key="description" name="description" content="Find pool" />
          <meta
            key="twitter:description"
            name="twitter:description"
            content="Find pool"
          />
          <meta
            key="og:description"
            property="og:description"
            content="Find pool"
          />
        </Head>

        <div className="relative py-8 space-y-4 rounded bg-black/30 border border-Gray maxMd:!mx-4">
          <Typography className="pl-7 space-y-3 font-normal text-lg text-white maxSm:mx-0 my-0">
            {i18n._(t`Import Pool`)}
          </Typography>
          <Divider className="border-Gray !mt-6 !mb-4" />
          <Alert
            className="mx-6 maxMd:mt-12 maxMd:mx-4"
            message={
              <>
                <b>{i18n._(t`Tip:`)}</b>{' '}
                {i18n._(
                  t`Use this tool to find pairs that don't automatically appear in the interface`
                )}
              </>
            }
            type="information"
          />

          <div className="mx-6 maxMd:mx-3">
            <CurrencySelectPanel
              popoverPanelClass="w-full !absolute"
              transitionCss="w-full max-w-[100%] relative"
              selectPanelClass="bg-ternary"
              currency={currency0}
              onClick={() => setActiveField(Fields.TOKEN0)}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={currency1}
              id="pool-currency-input"
            />
            <div className="flex justify-center items-center">
              <Button className="z-10 -my-[1.7rem] rounded-full bg-Gray-900 shadow-btnShadow p-2.5">
                <div className="p-2.5 rounded-full bg-primary">
                  <Plus size="32" stroke-width="1" color="white" />
                </div>
              </Button>
            </div>
            <CurrencySelectPanel
              popoverPanelClass="w-full !absolute"
              transitionCss="w-full max-w-[100%] relative"
              selectPanelClass="bg-ternary z-[0]"
              currency={currency1}
              onClick={() => setActiveField(Fields.TOKEN1)}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={currency0}
              id="pool-currency-output"
            />
          </div>

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
              ) : (
                <div className="p-3 mx-6 maxMd:mx-3 rounded bg-ternary/20">
                  <AutoColumn
                    gap="sm"
                    justify="center"
                    className="maxMd:text-sm"
                  >
                    {i18n._(t`You don’t have liquidity in this pool yet`)}
                    <Link
                      href={`/add/${currencyId(currency0)}/${currencyId(
                        currency1
                      )}`}
                    >
                      <Button
                        color="green"
                        variant="filled"
                        className="w-full text-base font-normal !text-white bg-primary hover:bg-primary/95 rounded-[0.350rem] !h-10"
                      >
                        {i18n._(t`Add liquidity`)}
                      </Button>
                    </Link>
                  </AutoColumn>
                </div>
              )
            ) : validPairNoLiquidity ? (
              <div className="p-3 mx-6 maxMd:mx-3 rounded bg-ternary/20">
                <AutoColumn gap="sm" justify="center">
                  {i18n._(t`No pool found`)}
                  <Link
                    href={`/add/${currencyId(currency0)}/${currencyId(
                      currency1
                    )}`}
                  >
                    <Button className="w-full text-base font-normal !text-white bg-primary hover:bg-primary/95 rounded-[0.350rem] h-[40px]">
                      {i18n._(t`Create pool`)}
                    </Button>
                  </Link>
                </AutoColumn>
              </div>
            ) : pairState === PairState.INVALID ? (
              <div className="p-2 mx-6 maxMd:mx-3 text-center rounded h-16 maxMd:h-10 flex flex-col justify-center items-center bg-ternary/20">
                {i18n._(t`Invalid pair`)}
              </div>
            ) : pairState === PairState.LOADING ? (
              <div className=" px-6 pb-4">
                <Dots>{i18n._(t`Loading`)}</Dots>
              </div>
            ) : null
          ) : !account ? (
            <div className="px-6 pb-4">
              {isDesktop ? (
                <Web3Connect className="w-full text-base font-normal text-white bg-primary hover:bg-primary/95 rounded-[0.350rem] !h-12 mt-4" />
              ) : (
                <Web3Status web3ConnectClass="bg-primary hover:bg-primary/90 hover:text-white/90 font-normal text-white rounded-[0.350rem]  w-full !h-12 mt-4" />
              )}
            </div>
          ) : (
            prerequisiteMessage
          )}

          {hasPosition && (
            <div className="p-3 mx-6 maxMd:mx-3 rounded bg-ternary/20">
              <AutoColumn gap="sm" justify="center">
                <Button
                  className="w-full text-base font-normal text-white rounded-[0.350rem] h-12"
                  color="btn_primary"
                  fullWidth={true}
                  onClick={() => {
                    router.push(`/pool`);
                  }}
                >
                  {i18n._(t`Manage this pool`)}
                </Button>
              </AutoColumn>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
