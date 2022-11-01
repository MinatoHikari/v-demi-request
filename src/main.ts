import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import Test from './components/test.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HelloWorld
        },
        {
            path:'/test',
            component:Test
        }
    ]
});

createApp(App).use(router).mount('#app');
