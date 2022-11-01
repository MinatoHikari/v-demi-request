<template>
    <button @click="boolean = !boolean">{{ boolean }}</button>
    <div>
        <button @click="$router.push('/')">totest</button>
    </div>
</template>

<script setup lang="ts">
import { useBool } from "./global";

const { boolean } = useBool();
</script>

<style scoped></style>
