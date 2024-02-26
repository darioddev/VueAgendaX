<script setup lang="ts">
import calendarMonth from '@/components/calendarMonth.vue';
import headerNav from '@/components/headerNav.vue';



</script>

<template>
    <div class="pt-20">
        <headerNav />
        <slot name="error"></slot>
        <calendarMonth>
            <template v-slot:loading>
            <slot name="loading"></slot>
            </template>
        </calendarMonth>
    </div>
</template>


<style scoped></style>