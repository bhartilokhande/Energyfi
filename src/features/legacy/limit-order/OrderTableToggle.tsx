import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useMemo } from 'react'

interface OrdersTableToggleProps {
  className?: string
  tableToggle?: string
  btnText?: string,
}

const OrdersTableToggle: FC<OrdersTableToggleProps> = ({
  className,
  tableToggle,
  btnText,
}) => {
  const { i18n } = useLingui()
  const { asPath } = useRouter()

  const items = useMemo(
    () => [
      {
        key: 'open',
        label: i18n._(t`Orders`),
        link: '/limit-order/open',
      },
      {
        key: 'history',
        label: i18n._(t`History`),
        link: '/limit-order/history',
      },
    ],
    [i18n]
  )

  return (
    <div className={classNames("flex gap-8", className)}>
      {items.map(({ label, link, key }, index) => (
        <Link href={link} key={index} passHref={true} replace={true}>
          <div className={classNames(
            `/limit-order/${key}` === asPath ? tableToggle : 'cursor-pointer')}>
            <Typography
              weight={700}
              className={classNames(
                `/limit-order/${key}` === asPath
                  ? 'text-white'
                  : '',
                'font-bold', btnText
              )}
            >
              {label}
            </Typography>
            <div
              className={classNames(
                `/limit-order/${key}` === asPath ? 'relative h-[3px] w-full' : ''
              )}
            />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default OrdersTableToggle
