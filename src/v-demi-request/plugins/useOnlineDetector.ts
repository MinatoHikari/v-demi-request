import { Ref, unref } from 'vue-demi';
import { useListeners } from '../core/methods';

export const useOnlineDetector = (
    send: (pure: boolean) => Promise<boolean>,
    inKeepAlive: boolean | Ref<boolean> = false
) => {
    const listener = () => {
        send(true);
    };

    const register = () => {
        window.addEventListener('online', listener);
    };

    const invoke = () => {
        window.removeEventListener('online', listener);
    };

    useListeners(register, invoke, unref(inKeepAlive));
};
