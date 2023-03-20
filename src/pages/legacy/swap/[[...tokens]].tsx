import { ArrowDownIcon } from '@heroicons/react/solid';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Currency,
  JSBI,
  Token,
  Trade as V2Trade,
  TradeType,
} from '@sushiswap/core-sdk';
import Banner from '../../../components/Banner';
import Button, { ButtonSwap } from '../../../components/Button';
import Divider from '../../../components/Divider';
import { SwapIcon } from '../../../components/Icon';
import RecipientField from '../../../components/RecipientField';
import Typography from '../../../components/Typography';
import Web3Connect from '../../../components/Web3Connect';
import Web3Status from '../../../components/Web3Status';
import ConfirmSwapModal from '../../../features/legacy/swap/ConfirmSwapModal';
import SwapCallbackError from '../../../features/legacy/swap/SwapCallbackError';
import SwapDetails from '../../../features/legacy/swap/SwapDetails';
import UnsupportedCurrencyFooter from '../../../features/legacy/swap/UnsupportedCurrencyFooter';
import HeaderNew from '../../../features/trade/HeaderNew';
import SwapAssetPanel from '../../../features/trident/swap/SwapAssetPanel';
import confirmPriceImpactWithoutFee from '../../../functions/prices';
import { warningSeverity } from '../../../functions/prices';
import { computeFiatValuePriceImpact } from '../../../functions/trade';
import { useAllTokens, useCurrency } from '../../../hooks/Tokens';
import PriceImpactModal from '../../../modals/priceImpact';
import {
  ApprovalState,
  useApproveCallbackFromTrade,
} from '../../../hooks/useApproveCallback';
import useDesktopMediaQuery from '../../../hooks/useDesktopMediaQuery';
import useENSAddress from '../../../hooks/useENSAddress';
import useIsArgentWallet from '../../../hooks/useIsArgentWallet';
import { useIsSwapUnsupported } from '../../../hooks/useIsSwapUnsupported';
import { useSwapCallback } from '../../../hooks/useSwapCallback';
import { useUSDCValue } from '../../../hooks/useUSDCPrice';
import useWalletSupportsOpenMev from '../../../hooks/useWalletSupportsOpenMev';
import useWrapCallback, { WrapType } from '../../../hooks/useWrapCallback';
import { SwapLayout, SwapLayoutCard } from '../../../layouts/SwapLayout';
import TokenWarningModal from '../../../modals/TokenWarningModal';
import { useActiveWeb3React } from '../../../services/web3';
import { Field, setRecipient } from '../../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../../state/swap/hooks';
import {
  useExpertModeManager,
  useUserOpenMev,
  useUserSingleHopOnly,
} from '../../../state/user/hooks';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactGA from 'react-ga';

import { fetchAPI } from '../../../lib/api';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { classNames } from '../../../functions';
import PriceImpactDetails from '../../../features/legacy/swap/PriceImpactDetails';

//  import Popover from '../../../components/Popover'
// import PopoverModal from '../../../components/Modal/PopoverModal'

export async function getServerSideProps() {
  try {
    const { data } = await fetchAPI('/banners?populate=image');
    return {
      props: { banners: data || [] },
    };
  } catch (e) {
    return {
      props: { banners: [] },
    };
  }
}

/* @ts-ignore TYPE NEEDS FIXING */
const Swap = ({ banners }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const { i18n } = useLingui();
  const loadedUrlParams = useDefaultsFromURLSearch();
  const { account } = useActiveWeb3React();
  const defaultTokens = useAllTokens();
  const [isExpertMode] = useExpertModeManager();
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    allowedSlippage,
    to,
  } = useDerivedSwapInfo();
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];

  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c?.isToken ?? false
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const { address: recipientAddress } = useENSAddress(recipient);

  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]:
              independentField === Field.INPUT
                ? parsedAmount
                : trade?.inputAmount,
            [Field.OUTPUT]:
              independentField === Field.OUTPUT
                ? parsedAmount
                : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  );

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT]);
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT]);
  const priceImpact = computeFiatValuePriceImpact(
    fiatValueInput,
    fiatValueOutput
  );
  const { onSwitchTokens, onCurrencySelection, onUserInput } =
    useSwapActionHandlers();

  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? /* @ts-ignore TYPE NEEDS FIXING */
        parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const userHasSpecifiedInputOutput = Boolean(
    /* @ts-ignore TYPE NEEDS FIXING */
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );

  const routeNotFound = !trade?.route;

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage
  );

  const signatureData = undefined;

  const handleApprove = useCallback(async () => {
    await approveCallback();
  }, [approveCallback]);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  const [useOpenMev] = useUserOpenMev();
  const walletSupportsOpenMev = useWalletSupportsOpenMev();

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    to,
    signatureData,
    /* @ts-ignore TYPE NEEDS FIXING */
    null,
    walletSupportsOpenMev && useOpenMev
  );

  const [singleHopOnly] = useUserSingleHopOnly();

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return;
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        });

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            singleHopOnly ? 'SH' : 'MH',
          ].join('/'),
        });

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly
            ? 'Swap with multihop disabled'
            : 'Swap with multihop enabled',
        });
        setIsShowModal(false);
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
        //setIsShowModal(false)
      });
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
    singleHopOnly,
  ]);

  // warnings on slippage
  // const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    );
  }, [priceImpact, trade]);

  const isArgentWallet = useIsArgentWallet();

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const swapIsUnsupported = useIsSwapUnsupported(
    currencies?.INPUT,
    currencies?.OUTPUT
  );

  const priceImpactCss = useMemo(() => {
    switch (priceImpactSeverity) {
      case 0:
      case 1:
      case 2:
      default:
        return 'text-low-emphesis';
      case 3:
        return 'text-yellow';
      case 4:
        return 'text-red';
    }
  }, [priceImpactSeverity]);
  const isDesktop = useDesktopMediaQuery();

  const handlePriceImpactToHigh = () => {
    setIsShowModal(true);
  };

  return (
    <>
      <PriceImpactModal isOpen={isShowModal} onConfirm={() => {}}>
        <PriceImpactDetails
          inputCurrency={currencies[Field.INPUT]}
          outputCurrency={currencies[Field.OUTPUT]}
          trade={trade}
          recipient={recipient ?? undefined}
          handleClose={() => setIsShowModal(false)}
          handleSwap={() => handleSwap()}
        />
      </PriceImpactModal>

      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        // @ts-ignore TYPE NEEDS FIXING
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        onDismiss={handleConfirmDismiss}
      />
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />
      <SwapLayoutCard>
        <HeaderNew
          className="!font-normal"
          inputCurrency={currencies[Field.INPUT]}
          outputCurrency={currencies[Field.OUTPUT]}
        />
        <Divider className="border-Gray mt-2 mb-4" />
        <div className="flex flex-col gap-3">
          <SwapAssetPanel
            spendFromWallet={true}
            header={(props) => (
              <SwapAssetPanel.Header
                popoverPanelClass="w-full !absolute"
                transitionCss="w-full max-w-[100%]"
                currencyInputClass="relative"
                {...props}
                label={
                  independentField === Field.OUTPUT && !showWrap
                    ? i18n._(t`Swap from (est.):`)
                    : i18n._(t`Swap from:`)
                }
              />
            )}
            currency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.INPUT]}
            onChange={handleTypeInput}
            onSelect={handleInputSelect}
            title="I want to swap"
          />
          <div className="flex justify-center -my-[45px] z-0">
            <div
              role="button"
              className="p-3 rounded-full shadow-btnShadow bg-Gray-900"
            >
              <ButtonSwap
                className="p-3 rounded-full shadow-btnShadow !bg-[#A466FF]"
                onClick={() => {
                  setApprovalSubmitted(false); // reset 2 step UI for approvals
                  onSwitchTokens();
                }}
              >
                {<SwapIcon />}
              </ButtonSwap>
            </div>
          </div>
          <SwapAssetPanel
            spendFromWallet={true}
            header={(props) => (
              <SwapAssetPanel.Header
                popoverPanelClass="w-full !absolute"
                transitionCss="w-full max-w-[100%]"
                currencyInputClass="relative"
                {...props}
                label={
                  independentField === Field.INPUT && !showWrap
                    ? i18n._(t`Swap to (est.):`)
                    : i18n._(t`Swap to:`)
                }
              />
            )}
            currency={currencies[Field.OUTPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onChange={handleTypeOutput}
            onSelect={handleOutputSelect}
            priceImpact={priceImpact}
            priceImpactCss={priceImpactCss}
            title="To"
          />
          {isExpertMode && (
            <RecipientField recipient={recipient} action={setRecipient} />
          )}
          {Boolean(trade) && (
            <SwapDetails
              inputCurrency={currencies[Field.INPUT]}
              outputCurrency={currencies[Field.OUTPUT]}
              trade={trade}
              recipient={recipient ?? undefined}
            />
          )}

          {trade && routeNotFound && userHasSpecifiedInputOutput && (
            <Typography variant="xs" className="text-center py-2">
              {i18n._(t`Insufficient liquidity for this trade.`)}{' '}
              {singleHopOnly && i18n._(t`Try enabling multi-hop trades`)}
            </Typography>
          )}

          {swapIsUnsupported ? (
            <Button
              color="red"
              disabled
              fullWidth
              className="w-full text-base font-normal text-white bg-primary rounded-[0.350rem] h-12"
            >
              {i18n._(t`Unsupported Asset`)}
            </Button>
          ) : !account ? (
            <>
              {isDesktop ? (
                <Web3Connect className="w-full text-base font-normal text-white bg-primary hover:bg-primary/95 rounded-[0.350rem] !h-12" />
              ) : (
                <Web3Status web3ConnectClass="bg-primary hover:bg-primary/90 hover:text-white/90 font-normal text-white rounded-[0.350rem]  w-full !h-12" />
              )}
            </>
          ) : showWrap ? (
            <Button
              fullWidth
              color="btn_primary"
              disabled={Boolean(wrapInputError)}
              onClick={onWrap}
              className="rounded-[0.350rem] md:rounded !h-12"
            >
              {wrapInputError ??
                (wrapType === WrapType.WRAP
                  ? i18n._(t`Wrap`)
                  : wrapType === WrapType.UNWRAP
                  ? i18n._(t`Unwrap`)
                  : null)}
            </Button>
          ) : showApproveFlow ? (
            <div>
              {approvalState !== ApprovalState.APPROVED && (
                <Button
                  fullWidth
                  variant="filled"
                  color="btn_primary"
                  loading={approvalState === ApprovalState.PENDING}
                  onClick={handleApprove}
                  disabled={
                    approvalState !== ApprovalState.NOT_APPROVED ||
                    approvalSubmitted
                  }
                  className="rounded-[0.350rem] md:rounded !h-10"
                >
                  {i18n._(t`Approve ${currencies[Field.INPUT]?.symbol}`)}
                </Button>
              )}
              {approvalState === ApprovalState.APPROVED && (
                <Button
                  variant="filled"
                  color={
                    isValid && priceImpactSeverity > 2 ? 'red' : 'btn_primary'
                  }
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap();
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }
                  }}
                  fullWidth
                  id="swap-button"
                  disabled={
                    !isValid ||
                    approvalState !== ApprovalState.APPROVED ||
                    (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  className="w-full text-base font-normal text-white hover:bg-primary/95 rounded-[0.350rem] !h-10"
                >
                  {priceImpactSeverity > 3 && !isExpertMode
                    ? i18n._(t`Price Impact High`)
                    : priceImpactSeverity > 2
                    ? i18n._(t`Swap Anyway`)
                    : i18n._(t`Swap`)}
                </Button>
              )}
            </div>
          ) : (
            <>
              <Button
                variant="filled"
                color={
                  isValid && priceImpactSeverity > 2 && !swapCallbackError
                    ? 'red'
                    : 'btn_primary'
                }
                fullWidth
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap();
                  } else {
                    if (priceImpactSeverity > 3 && !isExpertMode) {
                      handlePriceImpactToHigh();
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }
                  }
                }}
                id="swap-button"
                //disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                disabled={!isValid || !!swapCallbackError}
                className="w-full text-base font-normal text-white hover:bg-primary/95 rounded-[0.350rem] !h-10"
              >
                {swapInputError
                  ? swapInputError
                  : priceImpactSeverity > 3 && !isExpertMode
                  ? i18n._(t`Price Impact Too High`)
                  : priceImpactSeverity > 2
                  ? i18n._(t`Swap Anyway`)
                  : i18n._(t`Swap`)}
              </Button>
            </>
          )}
          {isExpertMode && swapErrorMessage ? (
            <SwapCallbackError error={swapErrorMessage} />
          ) : null}
          {swapIsUnsupported ? (
            <UnsupportedCurrencyFooter
              currencies={[currencies.INPUT, currencies.OUTPUT]}
            />
          ) : null}
        </div>
      </SwapLayoutCard>
      <Banner banners={banners} />
    </>
  );
};

Swap.Layout = SwapLayout('swap-page');
export default Swap;
