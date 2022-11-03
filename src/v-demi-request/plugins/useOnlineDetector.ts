import { Ref, unref } from 'vue-demi';
import { useListeners } from '../core/methods';
import { SendConfig } from "../types/option";

export const useOnlineDetector = (
    send: ({ pure, ignoreCache }?: SendConfig) => Promise<boolean>,
    inKeepAlive: boolean | Ref<boolean> = false
) => {
    const listener = () => {
        send({ pure: true });
    };

    const register = () => {
        window.addEventListener('online', listener);
    };

    const invoke = () => {
        window.removeEventListener('online', listener);
    };

    useListeners(register, invoke, unref(inKeepAlive));
};
