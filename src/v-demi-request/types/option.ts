import { Ref, WatchSource } from 'vue-demi';

export interface VDemiRequestOptions {
    /**
     * send request after useVDR being called
     */
    immediate?: boolean;
    /**
     * Once dependencies' value/result in it are all true, request can be sent normally
     */
    requiredDeps?: (WatchSource<unknown> | object)[];

    initWithCache?: boolean;
    cache?: boolean | CacheConfig;
    resendOnDocumentReactive?: boolean;
    refreshWhenOnline?: boolean;
    inKeepAlive?: boolean | Ref<boolean>;
    interval?: false | number | IntervalConfig;
    retry?: boolean | RetryConfig;
    onError?: (error: Ref<NonNullable<any> | null>) => void;
    onResponse?: (res: any) => void;
    onBeforeSend?: (key: Key) => void;
}

export type SimpleKey = string | WatchSource<string>;

export type Key = SimpleKey;

export type CacheConfig = {
    cacheTime: number;
    backgroundRequest: boolean;
};

export type RetryConfig = {
    interval: number;
    maxRetryTime: number;
    onError?: boolean;
};

export type IntervalConfig = {
    timeout: number;
    sendOnDocumentUnreactive: boolean;
    sendOffline: boolean;
};
