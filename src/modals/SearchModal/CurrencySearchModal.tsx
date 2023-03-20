import { Currency, Token } from '@sushiswap/core-sdk'
import { TokenList } from '@uniswap/token-lists'
import PopoverModal from 'app/components/Modal/PopoverModal'
import usePrevious from 'app/hooks/usePrevious'
import React, { createContext, FC, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useClickAway } from 'react-use'

import CurrencyModalView from './CurrencyModalView'
import { CurrencySearch } from './CurrencySearch'
import ImportList from './ImportList'
import { ImportToken } from './ImportToken'
import Manage from './Manage'

interface CurrencyModalContext {
  view: CurrencyModalView
  setView(x: CurrencyModalView): void
  importToken?: Token
  setImportToken(x: Token): void
  onDismiss(): void
  onSelect(x: Currency): void
  currency?: Currency
  includeNative?: boolean
  importList?: TokenList
  setImportList(x: TokenList): void
  listUrl?: string
  setListUrl(x: string): void
  showSearch: boolean
}

const CurrencyModalContext = createContext<CurrencyModalContext>({
  view: CurrencyModalView.search,
  setView: () => { },
  importToken: undefined,
  setImportToken: () => { },
  onDismiss: () => { },
  onSelect: () => { },
  currency: undefined,
  includeNative: true,
  importList: undefined,
  setImportList: () => { },
  listUrl: undefined,
  setListUrl: () => { },
  showSearch: true,
})

export const useCurrencyModalContext = () => useContext(CurrencyModalContext)

interface ComponentProps {
  onDismiss: () => void
  selectedCurrency?: Currency
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency
  showCommonBases?: boolean
  currencyList?: (string | undefined)[]
  includeNativeCurrency?: boolean
  allowManageTokenList?: boolean
  showSearch?: boolean
}

const Component: FC<ComponentProps> = ({
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  currencyList,
  showCommonBases = false,
  includeNativeCurrency = true,
  allowManageTokenList = true,
  showSearch = true,
}) => {
  const [view, setView] = useState<CurrencyModalView>(CurrencyModalView.search)
  const prevView = usePrevious(view)
  const [importToken, setImportToken] = useState<Token | undefined>()
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listUrl, setListUrl] = useState<string | undefined>()

  const modalRef = useRef(null)
  useClickAway(modalRef, () => {
    onDismiss()
  })

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  return (
    <CurrencyModalContext.Provider
      value={useMemo(
        () => ({
          view,
          setView,
          importToken,
          setImportToken,
          importList,
          setImportList,
          onDismiss,
          onSelect: handleCurrencySelect,
          currency: selectedCurrency,
          includeNative: includeNativeCurrency,
          listUrl,
          setListUrl,
          showSearch,
        }),
        [
          handleCurrencySelect,
          importList,
          importToken,
          includeNativeCurrency,
          listUrl,
          onDismiss,
          selectedCurrency,
          showSearch,
          view,
        ]
      )}
    >
      <div ref={modalRef} className="h-full flex flex-col gap-4 mb-md-2">
        {view === CurrencyModalView.search ? (
          <CurrencySearch
            otherSelectedCurrency={otherSelectedCurrency}
            showCommonBases={showCommonBases}
            currencyList={currencyList}
            allowManageTokenList={allowManageTokenList}
          />
        ) : view === CurrencyModalView.importToken && importToken ? (
          <ImportToken
            tokens={[importToken]}
            onBack={() =>
              setView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search)
            }
          />
        ) : view === CurrencyModalView.importList && importList && listUrl ? (
          <ImportList />
        ) : view === CurrencyModalView.manage ? (
          <Manage />
        ) : (
          <></>
        )}
      </div>
    </CurrencyModalContext.Provider>
  )
}

type CurrencySearchModal<P> = FC<P> & {
  Controlled: FC<CurrencySearchModalControlledProps>
}

interface CurrencySearchModalProps extends Omit<ComponentProps, 'onDismiss'> {
  trigger: ReactNode
  popoverPanelClass?: string;
  transitionCss?: string;
}

const CurrencySearchModal: CurrencySearchModal<CurrencySearchModalProps> = ({ trigger, popoverPanelClass, transitionCss, ...props }) => {
  return (
    <PopoverModal trigger={trigger} popoverPanelClass={popoverPanelClass} transitionCss={transitionCss}>
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      {({ setOpen }) => {
        return <Component {...props} onDismiss={() => setOpen(false)} />
      }}
    </PopoverModal>
  )
}

interface CurrencySearchModalControlledProps extends Omit<ComponentProps, 'onDismiss'> {
  open: boolean
  onDismiss(): void
  popoverPanelClass?: string
  transitionCss?: string
}

const CurrencySearchModalControlled: FC<CurrencySearchModalControlledProps> = ({ open, popoverPanelClass, transitionCss, onDismiss, ...props }) => {
  return (
    <PopoverModal.Controlled isOpen={open} onDismiss={onDismiss} transitionCss={transitionCss} popoverPanelClass={popoverPanelClass}>
      <Component {...props} onDismiss={onDismiss} />
    </PopoverModal.Controlled>
  )
}

CurrencySearchModal.Controlled = CurrencySearchModalControlled
export default CurrencySearchModal
