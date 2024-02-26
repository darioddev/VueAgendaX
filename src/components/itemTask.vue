<script setup lang="ts">
import taskModal from '@/components/taskModal.vue';
import type { TaskModelProps } from '@/interfaces/taskModelProps';

import useModal from '@/composables/useModal';
import { ref} from 'vue'
import type { taskModalProps } from '@/interfaces/taskModalProps'
const props = defineProps<taskModalProps>()
const task = ref<TaskModelProps>(JSON.parse(JSON.stringify(props.task)))

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
    <div class="w-full my-1 rounded-lg flex items-center justify-start shadow-md transition duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:scale-105"
        :style="{
            backgroundColor: props.task?.color.background,
            color: props.task?.color.text
        }" @click="toggleModalState" :draggable="true" @dragstart="transerIDForDrag">
        <i class='bx bx-task pl-2'></i>
        <p class="pl-2 text-md">{{ props.task?.title }}</p>
        <slot></slot>
    </div>
    <taskModal :showModal="modalState" :date="props.date" :task="task" @update:showModal="toggleModalState" />
</template>

<style lang="css" scoped></style>