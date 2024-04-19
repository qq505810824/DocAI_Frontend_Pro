'use client';

import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import AlertModel from '@/components/common/Widget/AlertModel';
import LoadModel from '@/components/common/Widget/LoadModel';
import { AlertProvider } from '@/context/AlertContext';
import { LoadProvider } from '@/context/LoadContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const canUseDOM = typeof window !== 'undefined';
const useIsomorphicLayoutEffect = canUseDOM ? React.useLayoutEffect : React.useEffect;

export default function RootLayout(props: { children: React.ReactNode }) {
    const router = useRouter();
    useIsomorphicLayoutEffect(() => {
        axios.defaults.headers.common['authorization'] =
            window.localStorage?.getItem('authorization') || '';
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('authorization');
                    localStorage.removeItem('email');
                    document.cookie = `authorization=null; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
                    router.push('/login');
                }
                return Promise.reject(error);
            }
        );
    }, [router]);

    return (
        <html lang="en">
            <body>
                <LoadProvider>
                    <SessionProvider>
                        <AlertProvider>
                            <script src="https://accounts.google.com/gsi/client" async defer></script>
                            <Helmet>
                                <script src="https://code.highcharts.com/highcharts.js"></script>
                            </Helmet>
                            <ThemeRegistry>{props.children}</ThemeRegistry>
                            <AlertModel />
                        </AlertProvider>
                    </SessionProvider>
                    <LoadModel />
                </LoadProvider>
            </body>
        </html>
    );
}
