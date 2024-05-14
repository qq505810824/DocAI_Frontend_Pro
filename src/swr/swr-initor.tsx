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
  const consoleToken = searchParams.get('console_token')
  const consoleTokenFromLocalStorage = localStorage?.getItem('console_token')
  const [init, setInit] = useState(false)

  useEffect(() => {
    // if (!(consoleToken || consoleTokenFromLocalStorage))
    //   router.replace('/login')

    // if (consoleToken) {
    //   localStorage?.setItem('console_token', consoleToken!)
    //   router.replace('/', { forceOptimisticNavigation: false } as any)
    // }
    setInit(true)
  }, [])

  return init
    ? (
      <SWRConfig value={{
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        // fetcher: url => useAxios(url, { manual: true })
      }}>
        {children}
      </SWRConfig>
    )
    : null
}

export default SwrInitor
