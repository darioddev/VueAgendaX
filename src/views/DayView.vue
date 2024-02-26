<script setup lang="ts">
import headerNav from '@/components/headerNav.vue'
import { transformStringToDateObject, transformDateToDateInfo } from '@/utils/date'
import { capitalize } from '@/utils/arrayString'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import useEventsStore from '@/stores/events'
const router = useRoute()
const day = ref<Date>(transformStringToDateObject(router.params.id as string, '-'))

</script>

<template>
    <headerNav />
    <div class="mt-20">
        <div class="flex items-start justify-start mx-2">
            <h1 class="text-2xl font-bold text-blue-600">
                {{ capitalize(transformDateToDateInfo(day)) }}
            </h1>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>