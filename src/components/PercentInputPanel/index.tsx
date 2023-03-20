import React from 'react'

import Input from '../Input'

interface PercentInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  id: string
}

export default function PercentInputPanel({ value, onUserInput, id }: PercentInputPanelProps) {
  return (
    <div id={id} className="p-5 rounded bg-popupBg">
      <div className="flex maxMd:flex-col gap-3">
        <div className="w-full text-white sm:w-2/5" style={{ margin: 'auto 0px' }}>
          Amount to Remove
        </div>
        <div className="flex items-center font-bold">
          <Input.Percent
            className="token-amount-input"
            percentInputCss="bg-field p-3 space-x-2 text-base rounded-[0.350rem]"
            value={value}
            onUserInput={(val) => {
              onUserInput(val)
            }}
            align="right"
          />
        </div>
      </div>
    </div>
  )
}
