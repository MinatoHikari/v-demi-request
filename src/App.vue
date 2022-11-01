<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import { useVDR } from './v-demi-request';
import { onMounted, ref, watch } from 'vue-demi';

export default defineComponent({
    name: 'App',
    components: {
        HelloWorld
    },
    setup() {
        const { data, error, send, loading, isPass } = useVDR(
            ref('https://api.github.com/users/MinatoHikari'),
            async (...params: any[]) => {
                const p = [...params];
                const res = await fetch(p[0], p[1]);
                console.log(res);
                if (res.status === 404) throw new Error('404!!!!!!');
                if (res.status === 403) throw new Error('403!!!!!!');
                return res;
            },
            {
                resendOnDocumentReactive: false,
                retry: false,
                cache: true
            }
        );

        return {
            data
        };
    }
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
