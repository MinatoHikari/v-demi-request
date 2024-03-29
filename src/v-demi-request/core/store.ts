import { computed, ref, Ref, unref, watch, ComputedRef, WatchStopHandle } from 'vue-demi';
import { Key, VDemiRequestOptions } from '../types/option';
import { useSimpleKey } from './methods';

let globalOptions: VDemiRequestOptions = {};

const store = ref(new Map<string, NonNullable<any> | null>());

export const useStore = <T>(key: Key, data: Ref<T | null>, options: VDemiRequestOptions) => {
    const simpleKey = unref(useSimpleKey(key));
    if (options.initWithCache && simpleKey) data.value = store.value.get(simpleKey) ?? null;

    const canceller = ref<WatchStopHandle | null>(null);

    const registerWatcher = (sourceKey: string) => {
        const simpleKey = useSimpleKey(key);
        if (!simpleKey) return;
        if (!canceller.value || simpleKey !== sourceKey) {
            if (canceller.value) canceller.value();
            canceller.value = watch(
                computed(() => store.value.get(simpleKey)),
                (val) => {
                    data.value = val;
                }
            );
            if (!!options.cache && typeof options.cache !== 'boolean') {
                setTimeout(() => {
                    canceller.value && canceller.value();
                    store.value.delete(simpleKey);
                }, options.cache.cacheTime);
            }
        }
    };

    const setCache = (value: NonNullable<any> | null) => {
        const simpleKey = useSimpleKey(key);
        if (simpleKey) {
            store.value.set(simpleKey, value);
            registerWatcher(simpleKey);
        }
    };

    const getCache = () => {
        const simpleKey = useSimpleKey(key);
        if (simpleKey) return store.value.get(simpleKey) ?? null;
    };

    const useCacheForRequestResult = () => {
        if (!!options.cache) {
            const cacheData = getCache();
            if (!!cacheData) {
                data.value = cacheData;
                return true;
            }
            return false;
        }
    };

    return {
        setCache,
        getCache,
        useCacheForRequestResult
    };
};

export const globalOptionsSetter = (options: VDemiRequestOptions) => {
    globalOptions = options;
};

export const globalOptionsGetter = () => {
    return globalOptions;
};
