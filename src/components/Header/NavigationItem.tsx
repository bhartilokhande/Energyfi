import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { MenuItem, MenuItemLeaf, MenuItemNode } from '../../components/Header/useMenu'
// @ts-ignore  
import Typography from 'app/components/Typography'
// @ts-ignore  
import { classNames } from 'app/functions'
// @ts-ignore  
import useDesktopMediaQuery, { useTouchDeviceMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useCallback, useRef } from 'react'
interface NavigationItem {
  node: MenuItem,
  onClose?(): void
}

export const NavigationItem: FC<NavigationItem> = ({ node, onClose }) => {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isDesktop = useDesktopMediaQuery()
  const touchDevice = useTouchDeviceMediaQuery()

  const handleToggle = useCallback((open, type) => {
    if (!open && type === 'enter') {
      buttonRef?.current?.click()
    } else if (open && type === 'leave') {
      buttonRef?.current?.click()
    }
  }, [])

  if (node && node.hasOwnProperty('link')) {
    const { link } = node as MenuItemLeaf
    const isOpenInNewTab = link.includes("https://");
    return (
      <Typography
        onClick={() => {router.push(link), onClose && onClose()}}
        weight={700}
        variant="sm"
        className={classNames(
          router.asPath === link ? 'text-primary' : 'text-white',
          'hover:text-primary text-white font-bold py-5 px-2 rounded flex gap-3 maxSm:font-semibold'
        )}
      >
        {!isDesktop && node.icon}
        {node.title}
      </Typography>
    )
  }
  return (
    <Popover key={node.key} className="flex relative">
      {({ open }) => (
        <div
          {...(!touchDevice && {
            onMouseEnter: () => handleToggle(open, 'enter'),
            onMouseLeave: () => handleToggle(open, 'leave'),
          })}
        >
          <Popover.Button ref={buttonRef}>
            <Typography
              weight={700}
              variant="sm"
              className={classNames(open ? 'text-white' : '', 'hover:text-primary text-white font-bold py-5 px-2 rounded flex gap-3 maxSm:font-semibold')}
            >
              {!isDesktop && node.icon}
              {node.title}
              <ChevronDownIcon strokeWidth={3} width={12} className=" maxSm:absolute maxSm:right-4 maxSm:mt-1" />
            </Typography>
          </Popover.Button>
          {node.hasOwnProperty('items') && (
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="z-10 w-full absolute w-40 translate-y-[-5px] translate-x-[-8px]">
                <div
                  className={classNames(
                    'shadow-md shadow-drop_shadow2 bg-field border hover:text-primary border-Gray rounded-[0.350rem] overflow-hidden min-w-[8rem]',
                    !touchDevice
                      ? "backdrop-blur-fallback before:z-[-1] before:rounded before:absolute before:w-full before:h-full before:content-[''] before:backdrop-blur-[20px] bg-field"
                      : 'bg-dark-800 inset-0'
                  )}
                >
                  {(node as MenuItemNode).items.map((leaf) => (
                    <Typography
                      variant="sm"
                      weight={700}
                      key={leaf.key}
                      onClick={() => {
                        router.push(leaf.link).then(() => buttonRef?.current?.click()), onClose && onClose()
                      }}
                      className=" p-2 flex items-center gap-2 hover:cursor-pointer text-white hover:text-primary m-0 rounded"
                    >
                      {leaf.icon}
                      {leaf.title}
                    </Typography>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          )}
        </div>
      )}
    </Popover>
  )
}