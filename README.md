# V-Demi-Request

## introduction

---

VDR(v-demi-request) is a data-fetching library for Vue3/Vue2 Composition-Api.

Features:

-   Written in Typescript
-   Auto error retry
-   Interval request
-   Online/offline/browser-tab-inactive detect
-   Custom request caller (Fetch/Axios/Any other library based on promise)
-   Auto cache
-   Dependence request

...balabala

## Quick start

---
基础用法

第二个参数可传入任意返回promise的请求函数

通常情况下，调用 useVDR 时请求 会立即触发，可在第三个参数传入 config 控制不立即触发
```javascript
import { useVDR } from 'v-demi-request';
import { defineComponent } from '@vue/runtime-core';

defineComponent({
    setup() {
        const { data, error } = useVDR('/api/getData', fetch);

        return {
            data,
            error
        };
    }
});
```
可传入 ref 或一个函数，unref 或 函数返回值的变化会触发请求

```javascript
import { useVDR } from 'v-demi-request';
import { defineComponent } from '@vue/runtime-core';
import axios from 'axios';

defineComponent({
    setup() {
        const params = {}
        const count = ref(0)
        const { data, error } = useVDR(ref(`/api/getData?count=${count.value}`), axios.post);

        return {
            data,
            error
        };
    }
});
```


自定义触发请求的依赖
只有当依赖全部为 true 的时候 key 的变化才会触发请求
此外，依赖值的变化也会触发请求
```javascript
import { useVDR } from 'v-demi-request';
import { defineComponent } from '@vue/runtime-core';
import axios from 'axios';

defineComponent({
    setup() {
        const params = {}
        const canRequrst = ref (false)
        const { data, error } = useVDR(['/api/getData', params], axios.post, {
            requiredDeps:[canRequrst]
        });

        return {
            data,
            error
        };
    }
});
```

### useVDR 参数

#### **immediate** `boolean`

调用 useVDR 后立刻进行一次请求

#### **requiredDeps** `(WatchSource<unknown> | object)[]`

依赖列表，监听列表内参数变化, 当发送请求或列表内依赖的值变化时，如果都依赖值有一项为 `false` 就不会发送请求

#### **initWithCache** `boolean`

初始化时启用请求缓存

#### **cache** `boolean | CacheConfig`

是否启用请求缓存，如启用则参数没有变化的情况下

`CacheConfig`:
- cacheTime: `number` 缓存过期时间;
- backgroundRequest: `boolean` 是否后台更新数据(如为 `true` 则请求时不会修改 `loading.value`);

#### **resendOnDocumentReactive** `boolean`

页面激活时是否重新请求

#### **refreshWhenOnline** `boolean`

页面从离线变成在线时是否重新请求

#### **inKeepAlive** `boolean`

是否根据在 keepalive 相关的两个生命周期内挂载/卸载 监听器

#### **interval** `false | number | IntervalConfig`

是否轮询

`false` 关闭

`number` 轮询的毫秒数

`IntervalConfig`:
- timeout: `number` 轮询的毫秒数
- sendOnDocumentUnreactive: `boolean` 是否在页面不激活时继续轮询
- sendOffline: `boolean` 是否在离线时继续轮询

#### **retry** `boolean | RetryConfig`

错误重试，设置为 `true` 或者 `RetryConfig` 时会在请求失败时按照一定时间间隔自动重试请求

`RetryConfig`:
- interval: `number` 如果设置，那么会按这个时间间隔重试错误而不使用默认的间隔; 
- maxRetryTime: `number` 最大重试次数; 
- onError?: `boolean` 暂时没用; 

#### **onError** `(error: Ref<NonNullable<any> | null>) => void`

报错时回调，用处和返回值内的 `onError` 一样

#### **onResponse** `(res: any) => void`

成功时回调，用处和返回值内的 `onSuccess` 一样

#### **onBeforeSend** `(key: Key) => void | boolean`

成功时回调，用处和返回值内的 `onBeforeSend` 一样
