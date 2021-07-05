import { Ref } from 'vue-demi';
import { Key, VDemiRequestOptions } from '../types/option';
import { useDocumentReActive } from './useDocumentReActive';
import { useOnlineDetector } from './useOnlineDetector';

export const usePlugins = <T>(
    states: {
        data: Ref<T | null>;
        error: Ref<NonNullable<any> | null>;
        intervalPause: Ref<boolean>;
    },
    methods: { send: (pure?: boolean) => Promise<boolean> },
    params: {
        key: Key;
        request: (...args: any) => Promise<any>;
        options: VDemiRequestOptions;
    }
) => {
    if (params.options.resendOnDocumentReactive)
        useDocumentReActive(methods.send, params.options.inKeepAlive ?? false);
    if (params.options.refreshWhenOnline)
        useOnlineDetector(methods.send, params.options.inKeepAlive ?? false);
};
