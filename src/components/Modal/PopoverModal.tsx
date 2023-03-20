import { Popover, Transition } from '@headlessui/react'
import ModalAction, { ModalActionProps } from 'app/components/Modal/Action'
import ModalActions, { ModalActionsProps } from 'app/components/Modal/Actions'
import ModalBody, { ModalBodyProps } from 'app/components/Modal/Body'
import ModalContent, {
  BorderedModalContent,
  ModalContentBorderedProps,
  ModalContentProps,
} from 'app/components/Modal/Content'
import ModalError, { ModalActionErrorProps } from 'app/components/Modal/Error'
import ModalHeader, { ModalHeaderProps } from 'app/components/Modal/Header'
import SubmittedModalContent, { SubmittedModalContentProps } from 'app/components/Modal/SubmittedModalContent'
import { classNames } from 'app/functions'
import { cloneElement, FC, isValidElement, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import React, { Fragment } from 'react'

const MAX_WIDTH_CLASS_MAPPING = {
  sm: 'lg:max-w-sm',
  md: 'lg:max-w-md',
  lg: 'lg:max-w-lg',
  xl: 'lg:max-w-xl',
  '2xl': 'lg:max-w-2xl',
  '3xl': 'lg:max-w-3xl',
}

import useDesktopMediaQuery from '../../hooks/useDesktopMediaQuery'
import { useClickAway } from 'react-use'

interface TriggerProps {
  open: boolean
  setOpen: (x: boolean) => void
  onClick: () => void
}

interface Props {
  trigger?: (({ open, onClick, setOpen }: TriggerProps) => ReactNode) | ReactNode
  popoverPanelClass?: string
  transitionCss?:string
}

type PopoverModalModalType<P> = FC<P> & {
  Controlled: FC<ControlledModalProps>
  Body: FC<ModalBodyProps>
  Actions: FC<ModalActionsProps>
  Content: FC<ModalContentProps>
  BorderedContent: FC<ModalContentBorderedProps>
  Header: FC<ModalHeaderProps>
  Action: FC<ModalActionProps>
  SubmittedModalContent: FC<SubmittedModalContentProps>
  Error: FC<ModalActionErrorProps>
}

const PopoverModal: PopoverModalModalType<Props> = ({ children: childrenProp, trigger: triggerProp, popoverPanelClass, transitionCss }) => {
  const [open, setOpen] = useState(false)

  const onClick = useCallback(() => {
    setOpen(true)
  }, [])

  // If trigger is a function, render props
  // Else (default), check if element is valid and pass click handler
  const trigger = useMemo(
    () =>
      typeof triggerProp === 'function'
        ? triggerProp({ onClick, open, setOpen })
        : isValidElement(triggerProp)
          ? cloneElement(triggerProp, { onClick })
          : null,
    [onClick, open, triggerProp]
  )

  // If children is a function, render props
  // Else just render normally
  // @ts-ignore TYPE NEEDS FIXING
  const children = useMemo(
    () => (typeof childrenProp === 'function' ? childrenProp({ onClick, open, setOpen }) : children),
    [onClick, open, childrenProp]
  )

  return (
    <>
      {trigger && trigger}
      <PopoverModalControlled isOpen={open} onDismiss={() => setOpen(false)} popoverPanelClass={popoverPanelClass} transitionCss={transitionCss}>
        {children}
      </PopoverModalControlled>
    </>
  )
}

interface ControlledModalProps {
  isOpen: boolean
  onDismiss: () => void
  afterLeave?: () => void
  children?: React.ReactNode
  transparent?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  unmount?: boolean
  popoverPanelClass?: string
  transitionCss?:string
}

const PopoverModalControlled: FC<ControlledModalProps> = ({
  isOpen,
  afterLeave,
  children,
  transparent = false,
  maxWidth = 'lg',
  unmount,
  popoverPanelClass,
  transitionCss,
}) => {
  const isDesktop = useDesktopMediaQuery()
  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave} unmount={unmount}>
      <div className={classNames("absolute w-full z-20 mt-2", transitionCss)} >
        <Popover className="relative">
          <div>
            <Transition.Child
              unmount={false}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel>
                <div
                  className={classNames(
                    transparent ? '' : popoverPanelClass, `!bg-popupBg border border-Gray overflow-auto hide-scrollbar`,
                    isDesktop ? `w-full max-h-[38vh]` : 'w-full max-h-[50vh] mx-auto',
                    ' rounded-md text-left overflow-hidden p-[9px]'
                  )}
                >
                  {children}
                </div>
              </Popover.Panel>
            </Transition.Child>
          </div>
        </Popover>
      </div>
    </Transition>
  )
}

PopoverModal.Controlled = PopoverModalControlled
PopoverModal.Header = ModalHeader
PopoverModal.Body = ModalBody
PopoverModal.Content = ModalContent
PopoverModal.BorderedContent = BorderedModalContent
PopoverModal.Actions = ModalActions
PopoverModal.Action = ModalAction
PopoverModal.Error = ModalError
PopoverModal.SubmittedModalContent = SubmittedModalContent

export default PopoverModal
