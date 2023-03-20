import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
interface BackProps {
  className?: string
}
const Back = React.forwardRef<HTMLButtonElement, BackProps>(({ className = "" }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  return (
    <div className={className}>
      <a onClick={router.back}
        className="flex items-center space-x-2 text-base text-center cursor-pointer font text-white hover:text-white/80 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{i18n._(t`Back`)}</span>
      </a>
    </div>
  )}
)
export default Back