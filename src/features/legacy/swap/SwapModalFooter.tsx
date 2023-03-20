import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import React, { FC, ReactNode } from 'react'

import SwapCallbackError from './SwapCallbackError'

interface SwapModalFooter {
  onConfirm: () => void
  swapErrorMessage?: ReactNode
  disabledConfirm: boolean
}

const SwapModalFooter: FC<SwapModalFooter> = ({ onConfirm, swapErrorMessage, disabledConfirm }) => {
  const { i18n } = useLingui()
  return (
    <div className="flex flex-col gap-4">
      <Button onClick={onConfirm} variant="filled" color="btn_primary" className='h-10 rounded-[0.350rem] !font-normal' disabled={disabledConfirm} id="confirm-swap-or-send">
        {i18n._(t`Confirm Swap`)}
      </Button>

      {swapErrorMessage && <SwapCallbackError error={swapErrorMessage} />}
    </div>
  )
}

export default SwapModalFooter
