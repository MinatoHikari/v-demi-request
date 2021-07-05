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
