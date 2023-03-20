import AnalyticsContainer from 'app/features/analytics/AnalyticsContainer';
import { useRouter } from 'next/router';
import Container from 'app/components/Container';
import { BackIcon } from 'app/components/Icon';
import Typography from 'app/components/Typography';
import React from 'react';

export default function Pool() {
  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()

  return (
    <AnalyticsContainer>
      <Container maxWidth="6xl" className="mx-auto w-full h-full p-3">
        <div className='py-10 flex gap-5'>
          <BackIcon onClick={() => router.back()} className='!cursor-pointer' />
          <Typography variant='h1' component='h1' className="!text-3xl !font-bold text-white ">
            Token
          </Typography>
        </div>
      </Container>
    </AnalyticsContainer>
  )
}
