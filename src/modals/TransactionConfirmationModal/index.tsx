import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency } from '@sushiswap/core-sdk'
import loadingRollingCircle from 'app/animation/loading-rolling-circle.json'
import loadingCircle from 'app/animation/loading-circle.json'
import receiptPrinting from 'app/animation/receipt-printing.json'
import Button from 'app/components/Button'
import ExternalLink from 'app/components/ExternalLink'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography';
import { getExplorerLink } from 'app/functions';
import useAddTokenToMetaMask from 'app/hooks/useAddTokenToMetaMask';
import { useActiveWeb3React } from 'app/services/web3';
import transactionReciept from '../../../public/images/transaction-done.gif'
import Lottie from 'lottie-react'
import React, { FC } from 'react'

interface ConfirmationPendingContentProps {
  onDismiss: () => void
  pendingText: string
}

export const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> = ({ onDismiss, pendingText }) => {
  const { i18n } = useLingui()
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Confirm transaction`)} onClose={onDismiss} />
      <HeadlessUiModal.BorderedContent className="flex flex-col items-center justify-center gap-1">
        <div className="w-16 py-8 m-auto">
          <Lottie animationData={loadingCircle} autoplay loop />
        </div>
        <Typography variant="lg" weight={700} className="text-white">
          {pendingText}
        </Typography>
        <Typography variant="sm">{i18n._(t`Confirm this transaction in your wallet`)}</Typography>
      </HeadlessUiModal.BorderedContent>
    </div>
  )
}

interface TransactionSubmittedContentProps {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
  inline?: boolean // not in modal
}

export const TransactionSubmittedContent: FC<TransactionSubmittedContentProps> = ({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}) => {
  const { i18n } = useLingui()
  const { library } = useActiveWeb3React()
  const { addToken, success } = useAddTokenToMetaMask(currencyToAdd)
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Transaction submitted`)} onClose={onDismiss} />
      <HeadlessUiModal.BorderedContent className="flex flex-col items-center justify-center gap-1">
        <div className="w-[102px] h-[102px] bg-popupBg flex items-center justify-center rounded-full">
        <img src={transactionReciept.src} alt="" className='rounded-full w-[5.5rem] h-auto' />
        </div>
        <Typography id="text-transaction-submitted" variant="sm" weight={700} className="text-white mt-2">
          {i18n._(t`Transaction Submitted`)}
        </Typography>
      </HeadlessUiModal.BorderedContent>

      {currencyToAdd && library?.provider?.isMetaMask && (
        <Button color='btnSecondary' onClick={!success ? addToken : onDismiss} className="h-10 rounded-[0.350rem]">
          <Typography variant="sm" weight={700}>
            {!success ? i18n._(t`Add ${currencyToAdd.symbol} to MetaMask`) : i18n._(t`Dismiss`)}
          </Typography>
        </Button>
      )}
    </div>
  )
}

interface ConfirmationModelContentProps {
  title: string
  onDismiss: () => void
  topContent?: React.ReactNode
  bottomContent?: React.ReactNode
}

export const ConfirmationModalContent: FC<ConfirmationModelContentProps> = ({
  title,
  bottomContent,
  onDismiss,
  topContent,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={title} onClose={onDismiss} />
      {topContent}
      {bottomContent}
    </div>
  )
}

interface TransactionErrorContentProps {
  message: string
  onDismiss: () => void
}

export const TransactionErrorContent: FC<TransactionErrorContentProps> = ({ message, onDismiss }) => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Transaction Rejected`)} onClose={onDismiss} />
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-1 text-center">
        <Typography variant="lg" weight={700} className="text-pink-red" component="span">
          {i18n._(t`Oops!`)}
        </Typography>
        <Typography variant="sm" weight={700} className="text-white" component="span">
          {message}
        </Typography>
      </HeadlessUiModal.BorderedContent>
      <Button variant='filled' color="btn_primary" className="w-full h-10 rounded-[0.350rem]" onClick={onDismiss}>
        {i18n._(t`Dismiss`)}
      </Button>
    </div>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash?: string
  content: React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency
  dialogCss?: string
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
  dialogCss,
}) => {
  const { chainId } = useActiveWeb3React()
  if (!chainId) return <></>
  return (
    <HeadlessUiModal.Controlled dialogCss={dialogCss} isOpen={isOpen} onDismiss={onDismiss} maxWidth="md" unmount={false}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content
      )}
    </HeadlessUiModal.Controlled>
  )
}

export default TransactionConfirmationModal
