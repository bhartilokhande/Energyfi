import React, { useCallback, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Currency } from '@sushiswap/core-sdk';
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal';
import { CurrencyLogo } from '../CurrencyLogo';
import { classNames } from 'app/functions';
import Button from '../Button';
interface CurrencySelectPanelProps {
  onClick?: () => void;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  label?: string;
  selectPanelClass?: string;
  transitionCss?: string;
  popoverPanelClass?: string;
}

export default function CurrencySelectPanel({
  onClick,
  onCurrencySelect,
  label = 'Input',
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
  selectPanelClass,
  transitionCss,
  popoverPanelClass,
}: CurrencySelectPanelProps) {
  const { i18n } = useLingui();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <div
      id={id}
      className={classNames(
        'px-6 pt-6 pb-10 maxMd:px-4 rounded-[0.350rem] bg-ternary',
        selectPanelClass
      )}
    >
      <div>
        {label && (
          <div className=" mb-1 text-sm font-normal text-secondary whitespace-nowrap">
            {label}
          </div>
        )}
        <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row rounded-md">
          <div className="w-full" onClick={onClick}>
            <div
              className="items-center h-full text-xl font-medium border-none outline-none cursor-pointer select-none"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true);
                }
              }}
            >
              <div className="flex items-center gap-2 mx-0 relative">
                {currency ? (
                  <div className="!w-full border border-Gray bg-field rounded-md">
                    <div className="ml-1 flex items-center gap-2 h-14">
                      {currency ? (
                        <CurrencyLogo currency={currency} size={'30px'} />
                      ) : null}
                      <div className="!w-full text-lg font-semibold font-normal text-white">
                        {currency &&
                        currency.symbol &&
                        currency.symbol.length > 20
                          ? currency.symbol.slice(
                              currency.symbol.length - 5,
                              currency.symbol.length
                            )
                          : currency?.symbol}
                      </div>
                      {!disableCurrencySelect && currency && (
                        <ChevronDownIcon
                          className={`${
                            currency ? 'text-white' : 'text-high-emphesis'
                          } stroke-current absolute right-4 text-white`}
                          width={16}
                          height={16}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <Button
                    color="green"
                    size="sm"
                    variant="filled"
                    id={id}
                    className="w-full text-base font-normal text-white bg-Green/95 rounded-[0.350rem] h-10"
                  >
                    {i18n._(t`Select a Token`)}
                    <ChevronDownIcon width={18} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal.Controlled
          open={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency ?? undefined}
          otherSelectedCurrency={otherCurrency ?? undefined}
          showCommonBases={showCommonBases}
          popoverPanelClass={popoverPanelClass}
          transitionCss={transitionCss}
        />
      )}
    </div>
  );
}
