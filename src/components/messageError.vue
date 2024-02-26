<script setup lang="ts">
import useModal from '@/composables/useModal';
import { watch } from 'vue';

interface MessageErrorProps {
    isError: boolean,
    message?: string
}

const {
    showModal,
    toggleModalState
} = useModal()

const props = withDefaults(defineProps<MessageErrorProps>(), {
    message: 'Ha habido un error al obtener los eventos, puede que no se muestren todos sus eventos o no se muestren en absoluto debido a un error en el servidor. Por favor, recargue la página y si el error persiste, contacte con el administrador del sistema.'
})

watch(() => props.isError, (newValue: boolean) => {
    if (newValue) {
        toggleModalState()
    }
})
</script>

<template>
    <div v-if="showModal" class="bg-red-200 border-l-4 border-red-500 text-red-700 p-1 m-2 relative" role="alert">
        <p class="font-bold">Error</p>
        <div class="flex flex-row items-center justify-between">
            <p class="w-4/5">{{ props.message }}</p>
            <i class='bx bx-x-circle cursor-pointer absolute top-0 right-0 mr-2 mt-2 bx-sm' title="Cerrar mensaje de error"
                @click="toggleModalState"></i>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>