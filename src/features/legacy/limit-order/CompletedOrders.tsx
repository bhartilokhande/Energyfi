import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import { useCompletedOrdersTableConfig } from 'app/features/legacy/limit-order/useCompletedOrdersTableConfig'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_TR_TH_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import Link from 'next/link'
import React, { FC } from 'react'
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

interface CompletedOrdersProps {
  thead?: string
}

const CompletedOrders: FC<CompletedOrdersProps> = ({thead}) => {
  const { i18n } = useLingui()
  const { completed } = useLimitOrders()
  const { config } = useCompletedOrdersTableConfig({ orders: completed.data })

  // @ts-ignore TYPE NEEDS FIXING
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
    // @ts-ignore TYPE NEEDS FIXING
    config,
    useSortBy,
    usePagination,
    useFlexLayout
  )

  return (
    <div className="flex flex-col gap-3 hide-scrollbar">
      <div className={classNames(completed.maxPages > 1 ? 'min-h-[537px]' : '')}>
        <table id="asset-balances-table" {...getTableProps()} className={TABLE_TABLE_CLASSNAME}>
          <thead className={thead}>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} className='justify-evenly' key={i}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    // @ts-ignore TYPE NEEDS FIXING
                    key={i}
                    className={TABLE_TR_TH_CLASSNAME(i, headerGroup.headers.length)}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length > 0 ? (
              // @ts-ignore TYPE NEEDS FIXING
              page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} key={i} className={TABLE_TBODY_TR_CLASSNAME}>
                    {/*@ts-ignore TYPE NEEDS FIXING*/}
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          key={i}
                          {...cell.getCellProps()}
                          className={classNames(
                            TABLE_TBODY_TD_CLASSNAME(i, row.cells.length),
                            'cursor-default whitespace-nowrap'
                          )}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            ) : (
              <tr className={TABLE_TBODY_TR_CLASSNAME}>
                <td colSpan={4} className={classNames(TABLE_TBODY_TD_CLASSNAME(0, 1), 'justify-center cursor-default')}>
                  <Typography
                    variant="xs"
                    className="text-center text-low-emphesis h-full min-h-[30vh] flex items-center justify-center"
                    component="span"
                  >
                    {i18n._(t`No order history`)}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        canPreviousPage={completed.page > 1}
        canNextPage={completed.page < completed.maxPages}
        onChange={(page) => completed.setPage(page + 1)}
        totalPages={completed.maxPages}
        currentPage={completed.page - 1}
        pageNeighbours={1}
      />
    </div>
  )
}

export default CompletedOrders
