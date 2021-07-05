import { Ref, unref } from 'vue-demi';
import { useListeners } from '../core/methods';

export const useDocumentReActive = (
    send: (pure: boolean) => Promise<boolean>,
    inKeepAlive: boolean | Ref<boolean> = false
) => {
    const listener = (e: Event) => {
        if (document.visibilityState === 'visible') {
            send(true);
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
