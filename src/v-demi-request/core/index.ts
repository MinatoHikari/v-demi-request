import { ref, readonly, computed, UnwrapRef, unref, Ref, WatchSource } from 'vue-demi';
import { Key, VDemiRequestOptions } from '../types/option';
import { mergeOptions, useDeps, useKey, useSimpleKey } from './methods';
import { usePlugins } from '../plugins';
import { globalOptionsSetter, useStore } from './store';
import { useInterval, useLocalUpdate, useRetry } from './ablility';
import { createEventHook, EventHookOn } from '@vueuse/core';
import { VDRResult } from '../types/main';

const setGlobalOptions = (options: VDemiRequestOptions) => {
    globalOptionsSetter(options);
};

function useVDR<K extends Key, T>(
    key: K,
    request: ((key: string) => Promise<T>) | (() => Promise<T>) | ((key?: string) => Promise<T>),
    oOptions: VDemiRequestOptions = {}
): VDRResult<T> {
    const options = mergeOptions(oOptions);
    const beforeSendHook = createEventHook();
    const responseHook = createEventHook<T>();
    const errorHook = createEventHook<T>();
    if (options.onBeforeSend) beforeSendHook.on(options.onBeforeSend);
    if (options.onResponse) beforeSendHook.on(options.onResponse);
    if (options.onError) beforeSendHook.on(options.onError);

    const data = ref<T | null>(null);
    const error = ref<any | null>(null);
    const loading = ref(false);
    const { setCache, useCacheForRequestResult } = useStore(key, data, options);

    const { isPass, onDepsChange } = useDeps(options.requiredDeps, [key]);

    const { localUpdate } = useLocalUpdate(data, setCache);

    /**
     * send request modified by useVDR
     * @param pure invoke interval casually
     */
    const send = async (pure: boolean = false) => {
        if (isPass.value) {
            if (useCacheForRequestResult()) return false;

            loading.value = true;

            await beforeSendHook.trigger({});
            const [unwrapKey] = useKey([key]);
            if (!unwrapKey) return false;
            return request(unwrapKey)
                .then((res) => {
                    data.value = ref(res).value;
                    responseHook.trigger(res);
                    if (!!options.cache) setCache(res);
                    if (!!options.interval && !pure) interval();
                    loading.value = false;
                    return true;
                })
                .catch((err) => {
                    error.value = err;
                    errorHook.trigger(err);
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

    onDepsChange(() => send());

    if (options.immediate) send();

    return {
        data: computed(() => data.value),
        error: computed(() => error.value),
        send,
        loading: computed(() => loading.value),
        isPass: computed(() => isPass.value),
        onSuccess: responseHook.on as EventHookOn<T>,
        onError: errorHook.on as EventHookOn,
        temporarilyUpdate: localUpdate
    };
}

export { useVDR, setGlobalOptions };
