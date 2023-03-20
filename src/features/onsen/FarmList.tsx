import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Dots from 'app/components/Dots'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { OnsenModalView } from 'app/features/onsen/enum'
import FarmListItemDetails from 'app/features/onsen/FarmListItemDetails'
import { usePositions } from 'app/features/onsen/hooks'
import { selectOnsen, setOnsenModalOpen, setOnsenModalState, setOnsenModalView } from 'app/features/onsen/onsenSlice'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import useSortableData from 'app/hooks/useSortableData'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC, useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-use'

import FarmListItem from './FarmListItem'

const SortIcon: FC<{ id?: string; direction?: 'ascending' | 'descending'; active: boolean }> = ({
  id,
  active,
  direction,
}) => {
  if (!id || !direction || !active) return <></>
  if (direction === 'ascending') return <ChevronUpIcon width={12} height={12} />
  if (direction === 'descending') return <ChevronDownIcon width={12} height={12} />
  return <></>
}

// @ts-ignore TYPE NEEDS FIXING
const FarmList = ({ farms, term }) => {
  const { items, requestSort, sortConfig } = useSortableData(farms, { key: 'tvl', direction: 'descending' })
  const urlData = useLocation();
  const cardId = urlData?.search?.replace('?id=', '');
  const { chainId } = useActiveWeb3React()
  const positions = usePositions(chainId)
  const { i18n } = useLingui()
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)
  const [selectedFarm, setSelectedFarm] = useState<any>()
  const dispatch = useAppDispatch()
  const { open } = useAppSelector(selectOnsen)

  const handleDismiss = useCallback(() => {
    setSelectedFarm(undefined)
    dispatch(setOnsenModalView(undefined))
  }, [dispatch])

  useEffect(() => {
    if (cardId) {
      let selected = null;
      if (items) {
        selected = items.filter(x => x.pair.id === cardId)[0]
      }
      if (selected) {
        setSelectedFarm(selected)
        dispatch(
          setOnsenModalState({
            view: positionIds.includes(selected.id) ? OnsenModalView.Position : OnsenModalView.Liquidity,
            open: true,
          })
        )
      }
    }
  }, [cardId])
  const positionIds = positions.map((el) => el.id)

  return items ? (
    <>
      <div className='w-full hide-scrollbar overflow-auto'>
        <div className="flex justify-between bg-field min-w-[768px] rounded-[0.350rem] !w-full overflow-auto">
          <div
            className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 4))}
            onClick={() => requestSort('pair.token0.symbol')}
          >
            <Typography className='!text-lightGray' weight={700}>
              {i18n._(t`Pool`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'symbol'} />
          </div>
          <div
            className={classNames('flex gap-1 maxLg:pl-8 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 4))}
            onClick={() => requestSort('tvl')}
          >
            <Typography className='!text-lightGray' weight={700}>
              {i18n._(t`TVL`)}
            </Typography>
            {/* <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'tvl'} /> */}
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(2, 4))}>
            <Typography className='!text-lightGray maxLg:mr[2px]' weight={700}>
              {i18n._(t`Rewards`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(3, 4))}
            onClick={() => requestSort('roiPerYear')}
          >
            <Typography className='!text-lightGray' weight={700}>
              {i18n._(t`APR`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'roiPerYear'} />
          </div>
        </div>
        <div className="min-w-[768px] pt-3">
          <InfiniteScroll
            dataLength={numDisplayed}
            next={() => setNumDisplayed(numDisplayed + 5)}
            hasMore={true}
            loader={null}
          >
            {items.slice(0, numDisplayed).map((farm, index) => (
              <FarmListItem
                farmListCss={`${index % 2 === 0 ? 'bg-popupBg rounded' : ''}`}
                key={index}
                farm={farm}
                onClick={() => {
                  setSelectedFarm(farm)
                  dispatch(
                    setOnsenModalState({
                      view: positionIds.includes(farm.id) ? OnsenModalView.Position : OnsenModalView.Liquidity,
                      open: true,
                    })
                  )
                }} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
      <HeadlessUiModal.Controlled
        isOpen={open}
        onDismiss={() => dispatch(setOnsenModalOpen(false))}
        afterLeave={handleDismiss}
        transitionChildCss="!bg-black/60"
        dialogCss="-mt-20"
      >
        {selectedFarm && (
          <FarmListItemDetails farm={selectedFarm} onDismiss={() => dispatch(setOnsenModalOpen(false))} />
        )}
      </HeadlessUiModal.Controlled>
    </>

  ) : (
    <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
  )
}

export default FarmList
