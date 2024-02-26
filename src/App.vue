<script setup lang="ts">
import useEvents from '@/composables/useEvents';
import loaderComponent from '@/components/loaderComponent.vue';
import messageError from '@/components/messageError.vue';
const { isLoading, isError } = useEvents({ fetchOnMount: true})
import '@/index.css'
</script>

<template>
  <router-view v-slot="{ Component }">
    <Component :is="Component">
      <template v-slot:error>
        <messageError :isError="isError" />
      </template>
      <template v-slot:loading>
        <loaderComponent :isLoading="isLoading" />
      </template>
    </Component>
  </router-view>
</template>

<style></style>
