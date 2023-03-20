import { formatNumber, formatPercent } from '../../functions'
import ColoredNumber from './ColoredNumber'

interface InfoCardProps {
  text: string
  number: number | string
  numberType?: 'usd' | 'text' | 'percent'
  percent: number
}

export default function InfoCard({ text, number, numberType = 'usd', percent }: InfoCardProps): JSX.Element {
  function switchNumber() {
    switch (numberType) {
      case 'usd':
        return formatNumber(number, true, false)
      case 'text':
        return number
      case 'percent':
        return formatPercent(number)
    }
  }

  return (
    <div className="w-full px-6 py-4 bg-ternary border border-Gray">
      <div className="whitespace-nowrap pb-1">{text}</div>
      <div className="flex items-center space-x-2">
        <div className="text-2xl text-white font-bold">{switchNumber()}</div>
        <ColoredNumber number={percent} percent={true} />
      </div>
    </div>
  )
}
