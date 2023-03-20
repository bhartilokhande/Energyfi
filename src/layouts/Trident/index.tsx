import Container, { MaxWidth } from 'app/components/Container'
import Footer from 'app/components/Footer'
import Header from 'app/components/Header'
import Main from 'app/components/Main'
import Popups from 'app/components/Popups'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

interface TridentHeaderProps {
  className?: string
  maxWidth?: MaxWidth
  condensed?: boolean
  classHeader?:string
}

export const TridentHeader: FC<TridentHeaderProps> = ({
  children,
  className,
  maxWidth = '7xl',
  condensed,
  classHeader,
}) => {
  return (
    <header className="relative w-full flex flex-col justify-center items-center">
      <Container
        maxWidth={maxWidth}
        className={classNames('flex', condensed && 'py-5', classHeader, className)}
      >
        {children}
      </Container>
    </header>
  )
}

interface TridentBodyProps {
  className?: string
  maxWidth?: MaxWidth
  classBody?: string
}

export const TridentBody: FC<TridentBodyProps> = ({ children,classBody, className, maxWidth = '7xl' }) => {
  return (
    <Main>
      <Container maxWidth={maxWidth} className={classNames('flex flex-col', className, classBody)}>
        {children}
      </Container>
    </Main>
  )
}

const TridentLayout: FC = ({ children = [] }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col items-center w-full flex flex-grow">
        <div className="w-full flex-grow flex flex-col">{children}</div>
        <Popups />
      </div>
      <Footer />
    </div>
  )
}

export default TridentLayout
