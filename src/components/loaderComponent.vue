<script setup lang="ts">

interface LoaderProps {
    isLoading: boolean
}

const props = defineProps<LoaderProps>()

</script>

<template>
    <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2" v-if="props.isLoading">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-700"></div>
    </div>
</template>

<style scoped>
</style>