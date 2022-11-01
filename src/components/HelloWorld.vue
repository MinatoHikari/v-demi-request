<template>
    <h1>{{ msg }}</h1>

    <p>
        Recommended IDE setup:
        <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
        +
        <a href="https://marketplace.visualstudio.com/items?itemName=octref.vetur" target="_blank">
            Vetur
        </a>
        or
        <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
        (if using
        <code>&lt;script setup&gt;</code>
        )
    </p>

    <p>
        See
        <code>README.md</code>
        for more information.
    </p>

    <p>
        <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Docs</a>
        |
        <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
    </p>

    <button type="button" @click="count++">count is: {{ count }}</button>
    <button type="button" @click="boolean = !boolean">boolean is: {{ boolean }}</button>
    <div>
        <button @click="$router.push('/test')">totest</button>
    </div>
    <p>
        Edit
        <code>components/HelloWorld.vue</code>
        to test hot module replacement.
    </p>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue';
import { useVDR } from '../v-demi-request';
import { useBool } from './global';
export default defineComponent({
    name: 'HelloWorld',
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    setup: () => {
        const count = ref(0);
        const { boolean } = useBool();
        const { isPass } = useVDR(
            ref('http://10.160.137.189:10000/verifyCode'),
            async (url?: string) => {
                return fetch(url ?? '');
            },
            {
                requiredDeps: [count, boolean],
                cache: false
            }
        );
        watch(boolean, (val) => {
            console.log('isPass', isPass.value);
        });
        return { count, boolean };
    }
});
</script>

<style scoped>
a {
    color: #42b983;
}

label {
    margin: 0 0.5em;
    font-weight: bold;
}

code {
    background-color: #eee;
    padding: 2px 4px;
    border-radius: 4px;
    color: #304455;
}
</style>
