import { Ref, unref } from 'vue-demi';
import { useListeners } from '../core/methods';
import { SendConfig } from '../types/option';

export const useDocumentReActive = (
    send: ({ pure, ignoreCache }?: SendConfig) => Promise<boolean>,
    inKeepAlive: boolean | Ref<boolean> = false
) => {
    const listener = (e: Event) => {
        if (document.visibilityState === 'visible') {
            send({ pure: true });
        }
    };

    const register = () => {
        document.addEventListener('visibilitychange', listener);
    };

    const invoke = () => {
        document.removeEventListener('visibilitychange', listener);
    };

    useListeners(register, invoke, unref(inKeepAlive));
};
