import Button, { ButtonProps } from 'app/components/Button'
import React, { FC } from 'react'

export interface ModalActionProps extends ButtonProps {
  main?: boolean
}

const ModalAction: FC<ModalActionProps> = ({ children, disabled, main = false, ...props }) => {
  return (
    <div className='w-full flex justify-center'>
      <Button {...props} color="btn_primary" className='h-10 rounded-[0.350rem] text-white w-[10rem]' disabled={disabled} variant={main ? 'filled' : 'empty'}>
        {children}
      </Button>
    </div>
  )
}

export default ModalAction
