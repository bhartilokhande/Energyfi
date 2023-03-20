import React from 'react'

interface InfoCardProps {
  text: string
  number: string
}

export default function InfoCard({ text, number }: InfoCardProps) {
  return (
    <div className="w-full py-4 border rounded-[0.350rem] px-6 !bg-transparent border-Gray">
      <div className="whitespace-nowrap">{text}</div>
      <div className="text-2xl font-bold">{number}</div>
    </div>
  )
}
