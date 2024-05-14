'use client';
import useAlert from '@/hooks/useAlert';
import useLoad from '@/hooks/useLoad';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SettingView from './SettingView';

import useSWR from 'swr';
import { getAction } from '../../swr/common'

export interface ShowCurrentUser {
    success: boolean;
    user?: {
        id: string | null;
        date_of_birth: string | null;
        nickname: string | null;
        phone: string | null;
        position: string | null;
        sex: 0 | 1 | null;
    };
}

function SettingContainer() {
    const { data: currentUserData, isLoading: currentUserLoading, error: currentUserError }
        = useSWR('/api/v1/users/me', getAction)
    return (
        <SettingView
            {...{
                currentUserData,
                currentUserLoading
            }}
        />
    );
}
export default SettingContainer;
