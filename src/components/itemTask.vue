<script setup lang="ts">
import taskModal from '@/components/taskModal.vue';
import useModal from '@/composables/useModal';
import useEventAction from '@/composables/useEventAction';
import type { taskModalProps } from '@/interfaces/taskModalProps'
import { getFormatDateParam } from '@/utils/date'
//import type { TaskModelProps } from '@/interfaces/taskModelProps';
//import { ref} from 'vue'
//const task = ref<TaskModelProps>(JSON.parse(JSON.stringify(props.task)))

const props = defineProps<taskModalProps>()
const {
    showModal: modalState,
    toggleModalState
} = useModal()
const {
    deleteEvent
} = useEventAction()


const transerIDForDrag = (event: DragEvent) => {
    if (props.task?.id) {
        event.dataTransfer?.setData('text/plain', props.task.id.toString() as string)
    }
}

</script>

<template>
    <div class="my-1 rounded-lg flex flex-col  justify-start shadow-md transition duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:scale-105"
        :class="{ 'w-full': !props.personalized }" :style="{
            backgroundColor: props.task?.color.background,
            color: props.task?.color.text
        }" :draggable="true" @dragstart="transerIDForDrag">
        <div v-if="props.personalized" class="flex items-center justify-center h-12 w-12 bg-gray-200 rounded-full mr-2 m-2">
            <i class="bx bx-task bx-sm"></i>
            <!-- Implementamos el id-->
            <p class="text-xs font-semibold">{{ props.task?.id }}</p>
        </div>
        <div v-else class="pl-2 flex flex-row items-center justify-start">
            <p class="text-sm font-semibold" v-if="!props.task?.star.allDay">{{ props.task?.star.time }}</p>
            <p class="pl-2 text-sm">{{ props.task?.title }}</p>
            <!-- boton de moficar-->
            <button class="ml-auto mr-1" @click="toggleModalState">
                <i class="bx bx-edit
                text-blue-500"></i>
            </button>
            <button class="mr-1" @click="deleteEvent(props.task?.id as number)">
                <i class="bx bx-trash text-red-500"></i>
            </button>
        </div>
        <div class="flex flex-col items-start justify-start p-2 text-black font-semibold flex-wrap"
            v-if="props.personalized">
            <p class="text-sm font-medium">{{ props.task?.title }}</p>
            <!-- Fecha y hora de creacion -->
            <p class="text-xs font-light">Creado: {{ getFormatDateParam(new Date(props.task?.dateCreated as string)) }} </p>
            <p class="text-xs font-light">Inicio: {{ getFormatDateParam(new Date(props.task?.star.date as string)) }},{{
                props.task?.star.time }}</p>
            <p class="text-xs font-light">Fin: {{ getFormatDateParam(new Date(props.task?.end?.date as string)) }},{{
                props.task?.end.time }}</p>
            <p class="text-xs font-light">
                Ultima modificacion: {{ (props.task?.dateModified) ? getFormatDateParam(new Date(props.task?.dateModified as
                    string)) : 'No se ha modificado' }}
            </p>
        </div>
    </div>

    <taskModal :showModal="modalState" :date="props.date" :task="JSON.parse(JSON.stringify(props.task))"
        @update:showModal="toggleModalState" />
</template>

<style lang="css" scoped></style>