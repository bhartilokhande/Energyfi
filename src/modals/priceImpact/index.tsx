import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import React, { FC } from 'react'


interface PriceImpact {
  isOpen: boolean
  onConfirm: () => void,
  children?: React.ReactNode
}

const PriceImpactModal: FC<PriceImpact> = ({ isOpen, onConfirm, children }) => {
  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} onDismiss={onConfirm}>
       {children}
    </HeadlessUiModal.Controlled>
  )
}

export default PriceImpactModal;
