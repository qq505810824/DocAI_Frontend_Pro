'use client'

import { SWRConfig } from 'swr'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import useAxios from 'axios-hooks';
import Api from '../apis';
const apiSetting = new Api();

type SwrInitorProps = {
  children: ReactNode
}
const SwrInitor = ({
  children,
}: SwrInitorProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const consoleToken = searchParams.get('authorization')
  const consoleTokenFromLocalStorage = localStorage?.getItem('authorization')
  const [init, setInit] = useState(false)

  useEffect(() => {
    // if (!(consoleToken || consoleTokenFromLocalStorage))
    //   router.replace('/login')

    // if (consoleToken) {
    //   localStorage?.setItem('authorization', consoleToken!)
    //   router.replace('/', { forceOptimisticNavigation: false } as any)
    // }
    setInit(true)
  }, [])

  return init
    ? (
      <SWRConfig value={{
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}>
        {children}
      </SWRConfig>
    )
    : null
}

export default SwrInitor
