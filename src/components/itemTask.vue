<script setup lang="ts">
import taskModal from '@/components/taskModal.vue';
import useModal from '@/composables/useModal';
import type { taskModalProps } from '@/interfaces/taskModalProps'
const props = defineProps<taskModalProps>()
const {
    showModal: modalState,
    toggleModalState
} = useModal()

const transerIDForDrag = (event: DragEvent) => {
    if (props.task?.id) {
        event.dataTransfer?.setData('text/plain', props.task.id.toString() as string)
    }
}
</script>

<template>
    <div class="w-full my-1 rounded-lg flex items-center justify-start shadow-md transition duration-300 ease-in-out"
        :style="{
            backgroundColor: props.task?.color.background,
            color: props.task?.color.text
        }" @click="toggleModalState"
        :draggable="true"
        @dragstart="transerIDForDrag"
        >
        <i class='bx bx-task pl-2'></i>
        <p class="pl-2 text-sm">{{ props.task?.title }}</p>
    </div>
    <taskModal :showModal="modalState" :date="props.date" :task="props.task" @update:showModal="toggleModalState" />
</template>

<style lang="css" scoped></style>