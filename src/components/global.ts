import { ref } from 'vue';
import { createGlobalState, } from '@vueuse/core';

export const useBool = createGlobalState(() => {
    const boolean = ref(false);

    return {
        boolean
    };
});
