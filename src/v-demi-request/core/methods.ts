import {
    getCurrentInstance,
    isReactive,
    isRef,
    onActivated,
    onBeforeMount,
    onDeactivated,
    onUnmounted,
    ref,
    unref,
    watch,
    WatchSource,
    Ref
} from 'vue-demi';
import { Key, VDemiRequestOptions } from '../types/option';
import { globalOptionsGetter } from './store';
import { createEventHook, EventHookOn } from '@vueuse/core';

export const mergeOptions = (options: VDemiRequestOptions) => {
    const defaultOptions = {
        immediate: true,
        requiredDeps: [],
        resendOnDocumentReactive: true,
        retry: true,
        initWithCache: true
    } as VDemiRequestOptions;

    const global = globalOptionsGetter();

    return { ...defaultOptions, ...global, ...options };
};

export const useListeners = (addFn: () => void, removeFn: () => void, inKeepalive: boolean) => {
    let invoked = false;

    const addFnWarp = () => {
        if (invoked) {
            addFn();
            invoked = false;
        }
    };

    const removeFnWarp = () => {
        if (!invoked) {
            removeFn();
            invoked = true;
        }
    };

    onBeforeMount(addFnWarp);

    onUnmounted(removeFnWarp);

    if (inKeepalive) {
        const vm = getCurrentInstance();
        onActivated(addFnWarp, vm);
        onDeactivated(removeFnWarp, vm);
    }
};

export const useSimpleKey = (key: Key): string => {
    if (typeof key === 'function') return key();
    return unref(key) as string;
};

export const useKey = <K>(key: [K]) => {
    try {
        return key.map((i) => {
            if (typeof i === 'function') return (i as CallableFunction)();
            return unref(i);
        });
    } catch (e) {
        console.error(e);
        return [null];
    }
};

export const useDeps = <K extends Key>(
    deps: (WatchSource<unknown> | object)[] | undefined,
    key: [K]
): {
    isPass: Ref<boolean>;
    onDepsChange: EventHookOn;
} => {
    const watchHook = createEventHook();
    const isPass = ref(true);

    let paramDeps: (WatchSource<unknown> | object)[] = [];
    paramDeps = key.filter((i) => isRef(i) || typeof i === 'function' || isReactive(i)) as (
        | object
        | WatchSource
    )[];

    const depsList = [...(deps ?? []), ...paramDeps];
    console.log(depsList);
    if (depsList.length > 0) {
        watch(
            depsList,
            (newValList) => {
                isPass.value = true;
                newValList.forEach((i) => {
                    if (!i) isPass.value = false;
                });
                if (isPass.value) {
                    watchHook.trigger({});
                }
            },
            {
                immediate: true
            }
        );
    }

    return {
        isPass,
        onDepsChange: watchHook.on
    };
};
