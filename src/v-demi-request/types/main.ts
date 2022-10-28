import { ComputedRef, Ref, UnwrapRef } from 'vue-demi';
import { EventHookOn } from '@vueuse/core';

export interface VDRResult<T> {
    data: ComputedRef<UnwrapRef<T> | null>;
    error: ComputedRef;
    send: (pure?: boolean) => Promise<boolean>;
    loading: ComputedRef<boolean>;
    isPass: ComputedRef<boolean>;
    onSuccess: EventHookOn<T>;
    onError: EventHookOn;
    temporarilyUpdate: (
        cb: (data: Ref<UnwrapRef<T> | null>, setCache: (p: any) => void) => void
    ) => void;
}
