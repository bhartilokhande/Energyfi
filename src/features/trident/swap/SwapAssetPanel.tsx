import { ChevronDownIcon } from '@heroicons/react/solid';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Currency, Percent, ZERO } from '@sushiswap/core-sdk';
import Button from 'app/components/Button';
import { CurrencyLogo } from 'app/components/CurrencyLogo';
import Divider from 'app/components/Divider';
import NumericalInput from 'app/components/Input/Numeric';
import QuestionHelper from 'app/components/QuestionHelper';
import Typography from 'app/components/Typography';
import {
  classNames,
  formatNumber,
  maxAmountSpend,
  tryParseAmount,
  warningSeverity,
} from 'app/functions';
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance';
import { useUSDCValue } from 'app/hooks/useUSDCPrice';
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal';
import { useActiveWeb3React } from 'app/services/web3';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import BentoBoxFundingSourceModal from '../add/BentoBoxFundingSourceModal';

interface SwapAssetPanel {
  error?: boolean;
  // @ts-ignore TYPE NEEDS FIXING
  header: (x) => React.ReactNode;
  // @ts-ignore TYPE NEEDS FIXING
  walletToggle?: (x) => React.ReactNode;
  currency?: Currency;
  currencies?: string[];
  value?: string;
  onChange(x?: string): void;
  onSelect?(x: Currency): void;
  spendFromWallet?: boolean;
  selected?: boolean;
  isItemShow?: boolean;
  priceImpact?: Percent;
  priceImpactCss?: string;
  disabled?: boolean;
  title?: string;
  className?: string;
  walletCLass?: string;
  currencyInputClass?: string;
  selectcurrencyClass?: string;
  popoverPanelClass?: string;
  transitionCss?: string;
}

const SwapAssetPanel = ({
  header,
  walletToggle,
  currency,
  value,
  onChange,
  onSelect,
  spendFromWallet,
  disabled,
  currencies,
  title,
  className,
  popoverPanelClass,
  transitionCss,
}: SwapAssetPanel) => {
  return (
    <div
      className={classNames(
        'rounded-[0.700rem] p-5 flex flex-col gap-2 mt-3 mb-1 bg-ternary',
        className
      )}
    >
      <Typography variant="sm" className="flex text-Gray-500 whitespace-nowrap">
        {title}
      </Typography>
      {header({
        disabled,
        onChange,
        value,
        currency,
        currencies,
        onSelect,
        walletToggle,
        spendFromWallet,
      })}
    </div>
  );
};

const WalletSwitch: FC<
  Pick<SwapAssetPanel, 'spendFromWallet' | 'disabled'> & {
    label: string;
    onChange(x: boolean): void;
    id?: string;
  }
> = ({ label, onChange, id, spendFromWallet, disabled }) => {
  const { i18n } = useLingui();

  const content = (
    <div className="flex gap-3 maxMd:grid">
      <Typography
        variant="xs"
        component="span"
        className={classNames(
          disabled ? 'pointer-events-none opacity-40' : '',
          'flex items-center gap-2 !justify-start'
        )}
      >
        {label}
      </Typography>
      <div className="flex items-center gap-1">
        <Typography
          id={id}
          role="button"
          onClick={() => onChange(!spendFromWallet)}
          variant="sm"
          component="span"
          className="flex items-center gap-1 px-4 py-2 rounded-full cursor-pointer text-white bg-Green hover:bg-Green/90"
        >
          {spendFromWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
        </Typography>
        <BentoBoxFundingSourceModal />
      </div>
    </div>
  );

  if (disabled) {
    return (
      <QuestionHelper text={i18n._(t`Not available for legacy route`)}>
        {content}
      </QuestionHelper>
    );
  }

  return content;
};

const InputPanel: FC<
  Pick<
    SwapAssetPanel,
    'currency' | 'value' | 'onChange' | 'disabled' | 'priceImpact'
  > & { priceImpactCss?: string }
> = ({ currency, value, onChange, disabled, priceImpact, priceImpactCss }) => {
  const usdcValue = useUSDCValue(tryParseAmount(value || '1', currency));
  const span = useRef<HTMLSpanElement | null>(null);
  const [width, setWidth] = useState(0);
  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan('0')) return 'text-green';
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return 'text-green';
    if (severity < 2) return 'text-yellow';
    if (severity < 3) return 'text-red';
    return 'text-red';
  }, [priceImpact]);

  useEffect(() => {
    if (span.current) {
      setWidth(value ? span?.current?.clientWidth + 8 : 60);
    }
  }, [value]);

  return (
    <Typography className="relative items-baseline gap-3 overflow-hidden z-[0]">
      <NumericalInput
        disabled={disabled}
        value={value || ''}
        onUserInput={onChange}
        placeholder="0.00"
        className="focus:placeholder:text-low-emphesis  text-white flex-grow w-full text-left bg-transparent  disabled:cursor-not-allowed text-2xl font-normal w-full"
        autoFocus
      />
    </Typography>
  );
};

const BalancePanel: FC<
  Pick<SwapAssetPanel, 'disabled' | 'currency' | 'onChange' | 'spendFromWallet'>
> = ({ disabled, currency, onChange, spendFromWallet }) => {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();
  const balance = useBentoOrWalletBalance(
    account ? account : undefined,
    currency,
    spendFromWallet
  );

  const handleClick = useCallback(() => {
    if (disabled || !balance || !onChange) return;
    onChange(maxAmountSpend(balance)?.toExact());
  }, [balance, disabled, onChange]);

  return (
    <div
      role="button"
      onClick={handleClick}
      className="md:flex text-sm text-white"
    >
      {i18n._(t`Balance :`)}
      <Typography
        role="button"
        onClick={handleClick}
        variant="sm"
        className="ml-2 text-right !font-semibold text-sm text-Indigo"
      >
        {balance ? balance.toSignificant(6) : '0.00'}
      </Typography>
    </div>
  );
};

const SwapAssetPanelHeader: FC<
  Pick<
    SwapAssetPanel,
    | 'currency'
    | 'currencies'
    | 'onSelect'
    | 'walletToggle'
    | 'spendFromWallet'
    | 'disabled'
    | 'onChange'
    | 'value'
    | 'disabled'
    | 'onChange'
    | 'priceImpact'
    | 'value'
    | 'priceImpactCss'
    | 'selected'
    | 'title'
    | 'error'
    | 'isItemShow'
    | 'walletCLass'
    | 'currencyInputClass'
    | 'selectcurrencyClass'
    | 'popoverPanelClass'
    | 'transitionCss'
  > & { label: string; id?: string }
> = ({
  walletToggle,
  currency,
  onSelect,
  spendFromWallet,
  id,
  currencies,
  onChange,
  disabled,
  priceImpact,
  value,
  priceImpactCss,
  selected,
  title,
  error,
  isItemShow,
  walletCLass,
  currencyInputClass,
  selectcurrencyClass,
  popoverPanelClass,
  transitionCss,
}) => {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();
  const balance = useBentoOrWalletBalance(
    account ? account : undefined,
    currency,
    spendFromWallet
  );
  const usdcValue = useUSDCValue(tryParseAmount(value || '1', currency));
  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan('0')) return 'text-green';
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return 'text-green';
    if (severity < 2) return 'text-yellow';
    if (severity < 3) return 'text-red';
    return 'text-red';
  }, [priceImpact]);

  const handleClick = useCallback(() => {
    if (disabled || !balance || !onChange) return;
    onChange(maxAmountSpend(balance)?.toExact());
  }, [balance, disabled, onChange]);

  const trigger = currency ? (
    <div
      id={id}
      className={classNames(
        'flex justify-between w-full bg-field border rounded-md border-Gray hover:border-Indigo',
        selectcurrencyClass
      )}
    >
      <div className="grid grid-col-2 ">
        <div className="flex items-center justify-between ml-3 mt-2 mb-2">
          <CurrencyLogo
            style={{ marginRight: '8px' }}
            currency={currency}
            className="!rounded-full overflow-hidden"
            size={30}
          />
          <div className="flex flex-col">
            <Typography
              variant="sm"
              className="!text-base font-semibold text-white"
            >
              {!spendFromWallet ? currency.wrapped.symbol : currency.symbol}
            </Typography>
            <Typography variant="sm" className="!text-xs text-Indigo">
              ({!spendFromWallet ? currency.wrapped.symbol : currency.symbol})
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex mt-1">
        {!isItemShow && (
          <div className="maxSm:hidden">
            <Typography
              role="button"
              onClick={handleClick}
              className="flex text-white !font-medium"
            >
              {i18n._(t`Balance :`)}
              <Typography
                role="button"
                onClick={handleClick}
                variant="sm"
                className="ml-1 !font-semibold text-sm text-Indigo"
              >
                {balance ? balance.toSignificant(6) : '0.00'}
                <span className="ml-0.5"></span>
                {!spendFromWallet ? currency.wrapped.symbol : currency.symbol}
              </Typography>
            </Typography>
            <Typography
              role="button"
              onClick={handleClick}
              variant="sm"
              className="mt-2 text-sm text-Indigo flex justify-end"
            >
              {usdcValue?.greaterThan(ZERO) && (
                <>$ {formatNumber(usdcValue?.toFixed(), false, true, 2)} </>
              )}
              {priceImpact && (
                <span className={priceImpactCss || priceImpactClassName}>
                  ({priceImpact?.toSignificant(2)}%)
                </span>
              )}
              USD
            </Typography>
          </div>
        )}
        <div className="w-14 flex justify-center mb-2">
          <ChevronDownIcon width={16} />
        </div>
      </div>
    </div>
  ) : (
    <Button
      color="green"
      size="sm"
      variant="filled"
      id={id}
      className="w-full text-base font-normal text-white bg-Green hover:bg-Green/95 rounded-[0.350rem] h-10"
    >
      {i18n._(t`Select a Token`)}
      <ChevronDownIcon width={18} />
    </Button>
  );

  return (
    <>
      <div className={classNames('items-end gap-x-3.5', currencyInputClass)}>
        <CurrencySearchModal
          selectedCurrency={currency}
          onCurrencySelect={(currency) => onSelect && onSelect(currency)}
          trigger={trigger}
          currencyList={currencies}
          popoverPanelClass={popoverPanelClass}
          transitionCss={transitionCss}
        />
        <div>
          <div className="flex mb-1 justify-between px-2 pt-3">
            <div className="">
              <InputPanel
                {...{
                  selected,
                  error,
                  currency,
                  currencies,
                  value,
                  onChange,
                  disabled,
                  onSelect,
                  priceImpact,
                  priceImpactCss,
                  spendFromWallet,
                  title,
                }}
              />
              {!isItemShow && (
                <div className="flex items-center justify-end text-sm text-Gray-500">
                  {usdcValue?.greaterThan(ZERO) && (
                    <>$ {formatNumber(usdcValue?.toFixed(), false, true, 2)} </>
                  )}
                  {priceImpact && (
                    <span className={priceImpactCss || priceImpactClassName}>
                      ({priceImpact?.toSignificant(2)}%)
                    </span>
                  )}
                </div>
              )}
            </div>
            {!isItemShow && (
              <Typography className="flex gap-2 text-sm !font-medium items-center  whitespace-nowrap text-Indigo">
                {currency
                  ? !spendFromWallet
                    ? currency.wrapped.symbol
                    : currency.symbol
                  : null}
                <Button
                  className="text-lg !text-Gray-500 font-semiblod pointer-events-auto rounded-[0.350rem] !bg-transparent border border-Green py-1 px-3 hover:!text-white"
                  onClick={handleClick}
                >
                  {i18n._(t`Max`)}
                </Button>
              </Typography>
            )}
          </div>
          <Divider className="border-Gray" />
        </div>
        {!isItemShow && (
          <div className="flex gap-1 justify-between items-baseline px-2 pt-2">
            <Typography
              variant="sm"
              className="flex text-white whitespace-nowrap"
            >
              {usdcValue?.greaterThan(ZERO) && (
                <>$ {formatNumber(usdcValue?.toFixed(), false, true, 2)} </>
              )}
              {priceImpact && (
                <span className={priceImpactCss || priceImpactClassName}>
                  ({priceImpact?.toSignificant(2)}%)
                </span>
              )}
            </Typography>
            <Typography
              variant="sm"
              className="flex !text-Gray-500 whitespace-nowrap"
            >
              USD
            </Typography>
          </div>
        )}
      </div>
      <div className={classNames('text-white', walletCLass)}>
        {walletToggle && walletToggle({ spendFromWallet })}
        {isItemShow && (
          <BalancePanel
            {...{ disabled, currency, onChange, spendFromWallet }}
          />
        )}
      </div>
    </>
  );
};

SwapAssetPanel.Header = SwapAssetPanelHeader;
SwapAssetPanel.Switch = WalletSwitch;

export default SwapAssetPanel;
