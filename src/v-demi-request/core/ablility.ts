import { SendConfig, VDemiRequestOptions } from '../types/option';
import { Ref, ref, unref } from 'vue-demi';
import { useListeners } from './methods';

export const useInterval = (
    send: ({ pure, ignoreCache }?: SendConfig) => Promise<boolean>,
    options: VDemiRequestOptions
) => {
    let timeout = 60000;
    let existTimeout: number | null = null;
    const intervalPause = ref(false);
    if (options.interval) {
        if (typeof options.interval !== 'number') {
            timeout = options.interval.timeout;
        } else {
            timeout = options.interval;
        }
    }

    const interval = () => {
        if (existTimeout) {
            clearTimeout(existTimeout);
            existTimeout = null;
        }
        if (!intervalPause.value) existTimeout = setTimeout(() => send(), timeout);
    };

    const doPause = () => {
        intervalPause.value = true;
    };
    const restart = () => {
        intervalPause.value = false;
        interval();
    };

    if (options.interval && typeof options.interval !== 'number') {
        const isInKeepalive = options.inKeepAlive ? unref(options.inKeepAlive) : false;

        if (!options.interval.sendOffline) {
            const addListener = () => {
                window.addEventListener('offline', doPause);
                window.addEventListener('online', restart);
            };
            const removeListener = () => {
                window.removeEventListener('offline', doPause);
                window.removeEventListener('online', restart);
            };

            useListeners(addListener, removeListener, isInKeepalive);
        }

        if (!options.interval.sendOnDocumentUnreactive) {
            const listener = () => {
                if (document.visibilityState === 'visible') return restart();
                if (document.visibilityState === 'hidden') doPause();
            };
            const addListener = () => {
                document.addEventListener('visibilitychange', listener);
            };
            const removeListener = () => {
                document.removeEventListener('visibilitychange', listener);
            };

            useListeners(addListener, removeListener, isInKeepalive);
        }
    }

    return {
        interval,
        intervalPause
    };
};

export const useRetry = (
    send: ({ pure, ignoreCache }?: SendConfig) => Promise<boolean>,
    options: VDemiRequestOptions
) => {
    const retryCount = ref(0);
    let maxCount = 8;
    let interval = 2000;
    if (typeof options.retry !== 'boolean' && options.retry) {
        maxCount = options.retry.maxRetryTime;
        interval = options.retry.interval;
    }

    const retry = () => {
        retryCount.value += 1;
        // Exponential backoff https://github.com/vercel/swr/blob/master/src/utils/config.ts
        const timeout = ~~((Math.random() + 0.5) * (1 << Math.min(retryCount.value, 8))) * interval;

        if (retryCount.value < maxCount)
            setTimeout(() => {
                send();
            }, timeout);
    };

    return {
        retry
    };
};

export const useLocalUpdate = <T>(data: Ref<T>, setCache: (value: any) => void) => {
    const localUpdate = (cb: (data: Ref<T>, setCache: (value: any) => void) => void) => {
        cb(data, setCache);
    };

    return {
        localUpdate
    };
};
