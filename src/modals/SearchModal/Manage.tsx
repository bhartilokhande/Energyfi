import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useCurrencyModalContext } from 'app/modals/SearchModal/CurrencySearchModal'
import React, { FC, useState } from 'react'

import CurrencyModalView from './CurrencyModalView'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'

const Manage: FC = () => {
  const { i18n } = useLingui()
  const { setView, onDismiss } = useCurrencyModalContext()
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <>
      <HeadlessUiModal.Header
        header={i18n._(t`Manage`)}
        onClose={onDismiss}
        onBack={() => setView(CurrencyModalView.search)}
      />
      <div className="flex maxMd:bg-black rounded-[0.350rem] -ml-2">
        {[i18n._(t`Lists`), i18n._(t`Tokens`)].map((title, i) => (
          <div
            key={i}
            className={classNames(
              tabIndex === i ? 'bg-Green hover:bg-Green/90 border border-transparent' : '',
              'w-full flex items-center justify-center ml-2 px-1 py-3 rounded-[0.350rem] cursor-pointer select-none border maxMd:border-0 maxMd:ml-0'
            )}
            onClick={() => setTabIndex(i)}
          >
            <Typography
              weight={700}
              className={classNames(
                tabIndex === i ? 'text-white' : 'text-white',
                'focus:outline-none'
              )}
            >
              {title}
            </Typography>
          </div>
        ))}
      </div>
      {tabIndex === 0 && <ManageLists />}
      {tabIndex === 1 && <ManageTokens />}
    </>
  )
}

export default Manage
