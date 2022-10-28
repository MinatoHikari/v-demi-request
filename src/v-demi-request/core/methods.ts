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

export const useSimpleKey = (key: Key) => {
    if (Array.isArray(key)) {
        if (typeof key[0] === 'function') return key[0]();
        return unref(key[0]);
    } else {
        if (typeof key === 'function') return key();
        return unref(key);
    }
};

export const useKey = (key: Key) => {
    try {
        if (Array.isArray(key)) {
            if (typeof key[0] === 'function') return [key[0](), ...key.slice(1)];
            return [unref(key[0]), ...key.slice(1)];
        } else {
            if (typeof key === 'function') return [key()];
            return [unref(key)];
        }
    } catch (e) {
        console.error(e);
        return [null];
    }
};

export const useDeps = <T>(
    deps: (WatchSource<unknown> | object)[] | undefined,
    key: Key
): {
    isPass: Ref<boolean>;
    onDepsChange: EventHookOn;
} => {
    const watchHook = createEventHook();
    const isPass = ref(true);

    let paramDeps: (WatchSource<unknown> | object)[] = [];
    if (Array.isArray(key)) {
        paramDeps = key.filter((i) => isRef(i) || typeof i === 'function' || isReactive(i));
    } else {
        if (isRef(key) || typeof key === 'function') paramDeps.push(key);
    }

    if (deps && deps.length > 0) {
        watch(
            [...deps, ...paramDeps],
            (newValList) => {
                isPass.value = true;
                newValList.forEach((i) => {
                    if (!i) isPass.value = false;
                });
                if (isPass) {
                    watchHook.trigger;
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
