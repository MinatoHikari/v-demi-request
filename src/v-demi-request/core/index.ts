import { ref, readonly, WatchSource } from 'vue-demi';
import { Key, VDemiRequestOptions } from '../types/option';
import { mergeOptions, useDeps, useKey} from './methods';
import { usePlugins } from '../plugins';
import { useStore } from './store';
import { useInterval, useLocalUpdate, useRetry } from "./ablility";

export const useVDR = <T>(
    key: Key,
    request: (...args: any) => Promise<any> = fetch,
    oOptions: VDemiRequestOptions
) => {
    const options = mergeOptions(oOptions);
    const data = ref<T | null>(null);
    const error = ref<any | null>(null);
    const loading = ref(false);
    const { setCache, useCacheForRequestResult } = useStore(key, data, options);

    const { isPass } = useDeps(options.requiredDeps, key);

    const { localUpdate } = useLocalUpdate(data, setCache);

    /**
     * send request modified by useVDR
     * @param pure invoke interval casually
     */
    const send = async (pure: boolean = false) => {
        if (isPass.value) {
            if (useCacheForRequestResult()) return false;

            loading.value = true;

            options.onBeforeSend && options.onBeforeSend(key);
            const params = useKey(key);
            if (!params[0]) return false;

            return request(...params)
                .then((res) => {
                    data.value = res;
                    options.onResponse && options.onResponse(res);
                    console.log(res);
                    if (!!options.cache) setCache(res);
                    if (!!options.interval && !pure) interval();
                    loading.value = false;
                    return true;
                })
                .catch((err) => {
                    error.value = err;
                    options.onError && options.onError(error);
                    if (!!options.retry) retry();
                    loading.value = false;
                    return false;
                });
        }
        return false;
    };

    const { interval, intervalPause } = useInterval(send, options);
    const { retry } = useRetry(send, options);

    usePlugins(
        {
            data,
            error,
            intervalPause
        },
        { send },
        {
            key,
            request,
            options
        }
    );

    if (options.immediate) send();

    return {
        data: readonly(data),
        error: readonly(error),
        send,
        loading: readonly(loading),
        isPass: readonly(isPass),
        localUpdate
    };
};
