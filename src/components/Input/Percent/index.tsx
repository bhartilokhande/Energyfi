import { classNames, escapeRegExp } from 'app/functions'
import React from 'react'

const inputRegex = RegExp(`^\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(
  ({
    value,
    onUserInput,
    placeholder,
    className,
    align,
    percentInputCss,
    fontSize = '24px',
    ...rest
  }: {
    value: string | number
    onUserInput: (input: string) => void
    error?: boolean
    fontSize?: string
    align?: 'right' | 'left'
    percentInputCss?: string
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        if (Number(nextUserInput) <= 100) {
          onUserInput(nextUserInput)
        }
      }
    }

    return (
      <div className={classNames('flex items-center',percentInputCss)}>
        <input
          value={value}
          onChange={(event) => {
            // replace commas with periods, because uniswap exclusively uses period as the decimal separator
            enforcer(event.target.value.replace(/,/g, '.').replace(/%/g, ''))
          }}
          // universal input options
          inputMode="decimal"
          title="Token Amount"
          autoComplete="off"
          autoCorrect="off"
          // text-specific options
          type="text"
          pattern="^[0-9]*$"
          placeholder={placeholder || '100'}
          maxLength={3}
          className={classNames(
            align === 'right' && 'text-right',
            'font-normal bg-transparent whitespace-nowrap text-ellipsis overflow-ellipsis w-full',
            className
          )}
          style={{ fontSize }}
          {...rest}
        />
        <div className="text-xl font-bold">%</div>
      </div>
    )
  }
)

Input.displayName = 'PercentInput'

export default Input
