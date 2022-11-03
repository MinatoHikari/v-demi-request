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
