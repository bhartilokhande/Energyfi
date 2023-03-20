import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Popover from 'app/components/Popover'
import QuestionHelper from 'app/components/QuestionHelper'
import Switch from 'app/components/Switch'
import TransactionSettings from 'app/components/TransactionSettings'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import useWalletSupportsOpenMev from 'app/hooks/useWalletSupportsOpenMev'
import { useActiveWeb3React } from 'app/services/web3'
import { useToggleSettingsMenu } from 'app/state/application/hooks'
import { useExpertModeManager, useUserOpenMev, useUserSingleHopOnly } from 'app/state/user/hooks'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useClickAway, useLocation } from 'react-use'
import { useAppDispatch } from 'app/state/hooks'

import { OPENMEV_ENABLED, OPENMEV_SUPPORTED_NETWORKS } from '../../config/openmev'
import { updateUserDeadline } from '../../state/user/actions'
import CloseIcon from '../CloseIcon'
import { SettingIcon } from '../Icon'

interface SettingsTabProps {
  placeholderSlippage?: Percent
  trident?: boolean
  className?: string
}

const SettingsTab: FC<SettingsTabProps> = ({ placeholderSlippage, className, trident = false }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const toggle = useToggleSettingsMenu()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [userUseOpenMev, setUserUseOpenMev] = useUserOpenMev()
  const walletSupportsOpenMev = useWalletSupportsOpenMev()
  const [showPopover, setShowPopover] = useState(false);
  const modalRef = useRef(null)

  useClickAway(modalRef, () => {
    setShowPopover(false)
  })

  return (
    <>
      <Popover
        placement="bottom-end"
        show={showPopover}
        className="shadow-drop_shadow1 mt-5 z-[11] w-80 maxMd:w-[20rem] maxSx:w-[17.5rem] mx-auto"
        content={
          <div
            ref={modalRef}
            className="flex flex-col gap-3 p-3 border rounded-md bg-popupBg w-full border-Gray"
          >
            <div className="flex flex-col gap-4 p-3 rounded border-Gray/90">
              <div className='flex items-center justify-between'>
                <Typography className="text-white/50 text-[10px] font-normal">
                  {i18n._(t`Transaction Settings`)}
                </Typography>
                <div className="flex items-center justify-center  cursor-pointer ">
                  <XIcon width={20} height={20} className="text-white " onClick={() => setShowPopover(!showPopover)} />
                </div>
              </div>
              <TransactionSettings placeholderSlippage={placeholderSlippage} trident={trident} />
            </div>
            <div className="flex flex-col p-2  rounded border-Gray/90">
              <Typography className="text-white/50 text-[10px] font-normal">
                {i18n._(t`Interface Settings`)}
              </Typography>
              {!trident && (
                <div className="flex items-center justify-between my-1.5 z-[12]">
                  <div className="flex items-center">
                    <Typography variant="xs" className="text-xs mr-2 font-normal text-white">
                      {i18n._(t`Disable multihops`)}
                    </Typography>
                    <QuestionHelper text={i18n._(t`Restricts swaps to direct pairs only.`)} />
                  </div>
                  <Switch
                    size="xs"
                    id="toggle-disable-multihop-button"
                    checked={singleHopOnly}
                    onChange={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
                    uncheckedIcon={<CloseIcon />}
                    checkedIcon={<CheckIcon className="text-green-900 " />}
                  />
                </div>
              )}
            </div>
          </div>
        }
      >
        <div className={classNames(className, 'flex items-center justify-center w-10 h-10 rounded-full cursor-pointer')}>
          {
            <SettingIcon width={26} height={26} className="transform rotate-90" onClick={() => setShowPopover(true)} />
          }

        </div>
      </Popover>
      <HeadlessUiModal.Controlled isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxWidth="md">
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={i18n._(t`Confirm`)} onClose={() => setShowConfirmation(false)} />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-3 !border-yellow/40">
            <Typography variant="xs" weight={700} className="text-secondary">
              {i18n._(t`Only use this mode if you know what you are doing.`)}
            </Typography>
            <Typography variant="sm" weight={700} className="text-yellow">
              {i18n._(t`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`)}
            </Typography>
          </HeadlessUiModal.BorderedContent>
          <Button
            id="confirm-expert-mode"
            color="btn_primary"
            variant="filled"
            onClick={() => {
              toggleExpertMode()
              setShowConfirmation(false)
            }}
            className="h-10 w-full rounded-[0.350rem]"
          >
            {i18n._(t`Enable Expert Mode`)}
          </Button>
        </div>
      </HeadlessUiModal.Controlled>
    </>
  )
}

export default SettingsTab
