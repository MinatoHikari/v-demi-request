import { Ref, ref } from 'vue';
import { createGlobalState, CreateGlobalStateReturn } from '@vueuse/core';

export const useBool: CreateGlobalStateReturn<{ boolean: Ref<boolean> }> = createGlobalState(() => {
    const boolean = ref(false);

    return {
        boolean
    };
});
