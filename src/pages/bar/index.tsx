import ExclamationIcon from '@heroicons/react/outline/ExclamationIcon';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { BAR_ADDRESS, ChainId, SUSHI, ZERO } from '@sushiswap/core-sdk';
import Button from 'app/components/Button';
import Container from 'app/components/Container';
import Divider from 'app/components/Divider';
import Dots from 'app/components/Dots';
import { ELogo } from 'app/components/Icon';
import Input from 'app/components/Input';
import Typography from 'app/components/Typography';
import { XEFT_CALL } from 'app/config/tokens';
import { classNames } from 'app/functions';
import { aprToApy } from 'app/functions/convert/apyApr';
import { tryParseAmount } from 'app/functions/parse';
import {
  ApprovalState,
  useApproveCallback,
} from 'app/hooks/useApproveCallback';
import useSushiBar from 'app/hooks/useSushiBar';
import TransactionFailedModal from 'app/modals/TransactionFailedModal';
import {
  useFactory,
  useNativePrice,
  useOneDayBlock,
  useTokens,
} from 'app/services/graph/hooks';
import { useBar } from 'app/services/graph/hooks/bar';
import { useActiveWeb3React } from 'app/services/web3';
import { useWalletModalToggle } from 'app/state/application/hooks';
import { useTokenBalance } from 'app/state/wallet/hooks';
import Head from 'next/head';
import Link from 'next/link';
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery';
import Web3Connect from 'app/components/Web3Connect';
import Web3Status from 'app/components/Web3Status';
import React, { FC, useState } from 'react';

const INPUT_CHAR_LIMIT = 12;

const sendTx = async (txFunc: () => Promise<any>): Promise<boolean> => {
  let success = true;
  try {
    const ret = await txFunc();
    if (ret?.error) {
      success = false;
    }
  } catch (e) {
    console.error(e);
    success = false;
  }
  return success;
};

const tabStyle =
  'flex justify-center items-center h-12 w-full rounded-[0.350rem] cursor-pointer md:text-base';
const activeTabStyle = `${tabStyle} text-white font-medium bg-Green rounded-[0.350rem] maxMd:text-black`;
const inactiveTabStyle = `${tabStyle} text-white font-medium maxMd:border border-Gray`;

const buttonStyle =
  'flex justify-center items-center w-full h-14 rounded-[0.350rem] font-medium text-lg  mt-5 focus:outline-none focus:ring';
const buttonStyleEnabled = `${buttonStyle} text-white font-medium bg-primary hover:opacity-90`;
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`;
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-primary/50`;
const buttonStyleConnectWallet = `${buttonStyle} text-white bg-primary hover:bg-opacity-90`;

export default function Stake() {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();
  const sushiBalance = useTokenBalance(
    account ?? undefined,
    SUSHI[ChainId.MOONBEAM]
  );
  const xSushiBalance = useTokenBalance(account ?? undefined, XEFT_CALL);

  const { enter, leave } = useSushiBar();

  const walletConnected = !!account;
  const toggleWalletModal = useWalletModalToggle();

  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const [input, setInput] = useState<string>('');
  const [usingBalance, setUsingBalance] = useState(false);

  const balance = activeTab === 0 ? sushiBalance : xSushiBalance;

  const formattedBalance = balance?.toSignificant(4);

  const parsedAmount = usingBalance
    ? balance
    : tryParseAmount(input, balance?.currency);

  const [approvalState, approve] = useApproveCallback(
    parsedAmount,
    BAR_ADDRESS[ChainId.MOONBEAM]
  );

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false);
      setInput(v);
    }
  };

  const handleClickMax = () => {
    // @ts-ignore TYPE NEEDS FIXING
    setInput(
      parsedAmount
        ? parsedAmount
            .toSignificant(balance.currency.decimals)
            .substring(0, INPUT_CHAR_LIMIT)
        : ''
    );
    setUsingBalance(true);
  };

  // @ts-ignore TYPE NEEDS FIXING
  const insufficientFunds =
    (balance && balance.equalTo(ZERO)) || parsedAmount?.greaterThan(balance);

  const inputError = insufficientFunds;

  const [pendingTx, setPendingTx] = useState(false);

  const buttonDisabled =
    !input || pendingTx || (parsedAmount && parsedAmount.equalTo(ZERO));

  const handleClickButton = async () => {
    if (buttonDisabled) return;

    if (!walletConnected) {
      toggleWalletModal();
    } else {
      setPendingTx(true);

      if (activeTab === 0) {
        if (approvalState === ApprovalState.NOT_APPROVED) {
          const success = await sendTx(() => approve());
          if (!success) {
            setPendingTx(false);
            // setModalOpen(true)
            return;
          }
        }
        const success = await sendTx(() => enter(parsedAmount));
        if (!success) {
          setPendingTx(false);
          setModalOpen(true);
          return;
        }
      } else if (activeTab === 1) {
        const success = await sendTx(() => leave(parsedAmount));
        if (!success) {
          setPendingTx(false);
          // setModalOpen(true)
          return;
        }
      }

      handleInput('');
      setPendingTx(false);
    }
  };

  const block1d = useOneDayBlock({ chainId: ChainId.MOONBEAM });

  const exchange = useFactory({ chainId: ChainId.MOONBEAM });

  const exchange1d = useFactory({
    chainId: ChainId.MOONBEAM,
    variables: {
      block: block1d,
    },
    shouldFetch: !!block1d,
  });

  const ethPrice = useNativePrice({ chainId: ChainId.MOONBEAM });

  const xSushi = useTokens({
    chainId: ChainId.MOONBEAM,
    variables: { where: { id: XEFT_CALL.address.toLowerCase() } },
  })?.[0];

  const bar = useBar();
  const [xSushiPrice] = [
    xSushi?.derivedETH * ethPrice,
    xSushi?.derivedETH * ethPrice * bar?.totalSupply,
  ];

  const APY1d = aprToApy(
    (((exchange?.volumeUSD - exchange1d?.volumeUSD) * 0.0005 * 365.25) /
      (bar?.totalSupply * xSushiPrice)) *
      100 ?? 0
  );
  const isDesktop = useDesktopMediaQuery();
  const StackingAPR: FC = () => {
    return (
      <div className="flex items-center justify-between w-full rounded bg-transparent ">
        <div className="flex w-full flex-col">
          <Typography className="mb-2 text-sm whitespace-nowrap md:text-lg md:leading-5 text-white">
            {i18n._(t`Staking APR`)}
          </Typography>
          <Link href={`/`}>
            <Button
              variant="filled"
              color="green"
              className="!h-10 mb-3 font-medium !w-full max-w-[12rem] rounded-[0.350rem] "
            >
              {i18n._(t`View Dashboard`)}
            </Button>
          </Link>
        </div>
        <div className="flex flex-col">
          <Typography className="mb-1 !font-semibold text-lg text-right text-white">
            {`${APY1d ? APY1d.toFixed(2) + '%' : i18n._(t`Loading...`)}`}
          </Typography>
          <Typography className="w-32 !text-sm text-right text-white md:w-64">
            {i18n._(t`Yesterday's APR`)}
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center">
      <Container
        id="bar-page"
        maxWidth="6xl"
        className="mx-auto px-2 pt-10 pb-10 md:pb-20 flex flex-col justify-center"
      >
        <Head>
          <title key="title">Stake | Energyfi</title>
          <meta
            key="description"
            name="description"
            content="Stake ENERGYFI in return for xENERGYFI, an interest bearing and fungible ERC20 token designed to share revenue generated by all ENERGYFI products."
          />
          <meta
            key="twitter:url"
            name="twitter:url"
            content="https://twitter.com/Energyfi_io"
          />
          <meta
            key="twitter:title"
            name="twitter:title"
            content="STAKE ENERGYFI"
          />
          <meta
            key="twitter:description"
            name="twitter:description"
            content="Stake ENERGYFI in return for xENERGYFI, an interest bearing and fungible ERC20 token designed to share revenue generated by all ENERGYFI products."
          />
          <meta
            key="twitter:image"
            name="twitter:image"
            content="https://twitter.com/Energyfi_io/photo"
          />
          <meta key="og:title" property="og:title" content="STAKE ENERGYFI" />
          <meta key="og:url" property="og:url" content="https://energyfi.io" />
          <meta
            key="og:image"
            property="og:image"
            content="https://energyfi.app/static/media/energyfi.20edbfa3.svg"
          />
          <meta
            key="og:description"
            property="og:description"
            content="Stake ENERGYFI in return for xENERGYFI, an interest bearing and fungible ERC20 token designed to share revenue generated by all ENERGYFI products."
          />
        </Head>
        <Typography variant="h3" className="text-white mb-5">
          {i18n._(t`Staking`)}
        </Typography>
        <div className="bg-black/30 rounded-[0.350rem] py-4 px-6 maxMd:px-3 maxMd:py-2">
          <div className="maxSm:hidden">
            <StackingAPR />
            <Divider className="border-Gray" />
          </div>
          <div className="grid grid-cols-05 maxMd:grid-cols-1 gap-x-10 mt-8 mb-5 maxMd:mt-4">
            <div className="flex flex-col w-full mx-auto">
              <div>
                <TransactionFailedModal
                  isOpen={modalOpen}
                  onDismiss={() => setModalOpen(false)}
                />
                <div className="w-full max-w-2xl">
                  <div className="flex w-full rounded-[0.350rem] maxMd:gap-2 h-12 bg-black maxMd:bg-transparent maxMd:border-0 border border-Gray ">
                    <div
                      className="h-full w-6/12 "
                      onClick={() => {
                        setActiveTab(0);
                        handleInput('');
                      }}
                    >
                      <div
                        className={
                          activeTab === 0 ? activeTabStyle : inactiveTabStyle
                        }
                      >
                        <Typography className="font-medium text-md ">
                          {i18n._(t`Stake EFT`)}
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="h-full w-6/12 "
                      onClick={() => {
                        setActiveTab(1);
                        handleInput('');
                      }}
                    >
                      <div
                        className={
                          activeTab === 1 ? activeTabStyle : inactiveTabStyle
                        }
                      >
                        <Typography className="font-medium text-md">
                          {i18n._(t`Unstake`)}
                          <span className="md:hidden ml-1.5">
                            {i18n._(t`EFT`)}
                          </span>
                        </Typography>
                        <p></p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full mt-4">
                    <Typography className="maxMd:hidden font-medium text-xl text-white">
                      {activeTab === 0
                        ? i18n._(t`Stake EFT`)
                        : i18n._(t`Unstake`)}
                    </Typography>
                  </div>

                  <Input.Numeric
                    value={input}
                    onUserInput={handleInput}
                    className={classNames(
                      `w-full h-14 pl-[3rem] mt-3 md:mt-5 rounded-[0.350rem] bg-field text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap caret-high-emphesis ${
                        inputError ? '!pl-[5rem]' : ''
                      }`,
                      inputError ? ' pl-9 md:pl-12' : ''
                    )}
                    placeholder=" "
                  />
                  {/* input overlay: */}
                  <div className="relative w-full h-0 pointer-events-none bottom-14">
                    <div
                      className={`flex justify-between items-center h-14 rounded px-3 ${
                        inputError ? ' border border-red' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="bg-white p-2 rounded-full flex items-center justify-center ">
                          <ELogo className="w-[15px] h-[15px]" />
                        </span>
                        <div className="border-r border-Gray h-10" />
                        {inputError && (
                          <ExclamationIcon color="red" width={20} />
                        )}
                        <Typography
                          className={`text-lg !font-semibold whitespace-nowrap ${
                            input ? 'text-high-emphesis' : 'text-secondary'
                          }`}
                        >
                          {`${input ? input : '0'} ${
                            activeTab === 0 ? '' : 'x'
                          }EFT`}
                        </Typography>
                      </div>
                      <div className="flex items-center text-sm text-secondary md:text-base">
                        <Button
                          className="text-lg !text-Gray-500 font-semiblod pointer-events-auto rounded-[0.350rem] !bg-transparent border border-Green py-1 px-3"
                          onClick={handleClickMax}
                        >
                          {i18n._(t`Max`)}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-Gray-500">
                    {`1 xEFT = ${Number(bar?.ratio ?? 0)?.toFixed(4)} EFT`}
                  </div>
                  {(approvalState === ApprovalState.NOT_APPROVED ||
                    approvalState === ApprovalState.PENDING) &&
                  activeTab === 0 ? (
                    <Button
                      color="btn_primary"
                      variant="filled"
                      className="w-full h-12 rounded-[0.350rem] mt-3 text-white"
                      disabled={approvalState === ApprovalState.PENDING}
                      onClick={approve}
                    >
                      {approvalState === ApprovalState.PENDING ? (
                        <Dots>{i18n._(t`Approving`)} </Dots>
                      ) : (
                        i18n._(t`Approve`)
                      )}
                    </Button>
                  ) : !account ? (
                    <>
                      {isDesktop ? (
                        <Web3Connect className="w-full text-base font-normal text-white bg-primary hover:bg-primary/95 rounded-[0.350rem] !h-12" />
                      ) : (
                        <Web3Status web3ConnectClass="bg-primary hover:bg-primary/90 hover:text-white/90 font-normal text-white rounded-[0.350rem]  w-full !h-12" />
                      )}
                    </>
                  ) : (
                    <Button
                      color="btn_primary"
                      variant="filled"
                      className="w-full h-12 rounded-[0.350rem] mt-3 text-white bg-primary"
                      onClick={handleClickButton}
                      disabled={inputError}
                    >
                      {!walletConnected
                        ? i18n._(t`Connect Wallet`)
                        : !input
                        ? i18n._(t`Enter Amount`)
                        : insufficientFunds
                        ? i18n._(t`Insufficient Balance`)
                        : activeTab === 0
                        ? i18n._(t`Confirm Staking`)
                        : i18n._(t`Confirm Withdrawal`)}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded bg-ternary maxMd:bg-transparent p-6 maxMd:p-0 maxMd:mt-7">
              <Typography className="!font-normal text-sm md:text-base text-white">
                {i18n._(t`Balance`)}
              </Typography>
              <div className="flex items-center border border-Gray rounded-[0.350rem] h-14">
                <div className="flex items-center w-full mx-2.5">
                  <span className="bg-white p-2 rounded-full">
                    <ELogo className="w-[15px] h-[15px]" />
                  </span>
                  <div className="flex items-center justify-between w-full">
                    <Typography className="!font-semibold text-sm md:text-base text-white ml-2">
                      xEFT
                    </Typography>
                    <Typography className="text-sm !font-semibold text-white">
                      {xSushiBalance ? xSushiBalance.toSignificant(4) : '-'}
                      {console.log(
                        xSushiBalance,
                        'inputinputinputinputinputinput'
                      )}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex items-center border border-Gray rounded-[0.350rem] h-14">
                <div className="flex items-center w-full mx-2.5">
                  <span className="bg-white p-2 rounded-full">
                    <ELogo className="w-[15px] h-[15px]" />
                  </span>
                  <div className="flex items-center justify-between w-full">
                    <Typography className="!font-semibold text-sm md:text-base text-white ml-2">
                      EFT
                    </Typography>
                    <Typography className="text-sm !font-semibold text-white">
                      {sushiBalance ? sushiBalance.toSignificant(4) : '-'}
                    </Typography>
                  </div>
                </div>
              </div>

              {account && (
                <Link href={`/analytics/xenergyfi`}>
                  <Button
                    variant="outlined"
                    className="h-[3.1rem] w-full mt-[0.4rem] rounded-[0.350rem] transition hover:bg-Green text-white hover:border-Green"
                  >
                    {i18n._(t`Your xEFT Stats`)}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
