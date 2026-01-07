'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import sdk from '@farcaster/frame-sdk';

interface FarcasterContextType {
    isSDKLoaded: boolean;
    context?: Awaited<typeof sdk.context>;
    user?: {
        fid: number;
        username?: string;
        displayName?: string;
        pfpUrl?: string;
    };
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined);

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<Awaited<typeof sdk.context>>();

    useEffect(() => {
        const load = async () => {
            const ctx = await sdk.context;
            setContext(ctx);
            sdk.actions.ready();
        };
        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }
    }, [isSDKLoaded]);

    return (
        <FarcasterContext.Provider value={{
            isSDKLoaded,
            context,
            user: context?.user ? {
                fid: context.user.fid,
                username: context.user.username,
                displayName: context.user.displayName,
                pfpUrl: context.user.pfpUrl
            } : undefined
        }}>
            {children}
        </FarcasterContext.Provider>
    );
}

export function useFarcaster() {
    return useContext(FarcasterContext);
}
