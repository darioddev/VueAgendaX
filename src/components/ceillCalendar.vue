<script setup lang="ts">
import taskModal from '@/components/taskModal.vue';
import useModal from '@/composables/useModal';
import itemTask from '@/components/itemTask.vue';
import useEventsStore from '@/stores/events';
import useEventAction from '@/composables/useEventAction';

import { useRouter } from 'vue-router';
import type { TaskModelProps } from '@/interfaces/taskModelProps';
import { transformStringToDateObject, getFormatDateParam, transformStringToDate } from '@/utils/date'
import { transformArrayStringToNumber } from '@/utils/arrayString'
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia';

interface Props {
    fecha: string
}
const redirect = useRouter()

const {
    showModal: modalState,
    toggleModalState
} = useModal()
const {
    updateEvent: handleUpdateEvent
} = useEventAction()

const store = useEventsStore()
const { filterForDate , getEventById } = store


const props = defineProps<Props>()
const dateProps = ref<Date>(transformStringToDateObject(props.fecha))
const tasks = ref<Array<TaskModelProps>>([])

const updateForDate = async (event: DragEvent) => {
    // Obtengo el id de la tarea , mediante el evento de arrastrar y soltar 
    const id: number = Number(event.dataTransfer?.getData('text/plain'))
    // Busco la tarea por el id , si existe y la fecha de la tarea es diferente a la fecha actual , preguntar si desea mover la tarea a la fecha actual
    const task = getEventById(id as number) as TaskModelProps
    // Si la tarea existe y la fecha de la tarea es diferente a la fecha actual , preguntar si desea mover la tarea a la fecha actual
    if (task && task.date !== dateProps.value.toLocaleDateString()) {
        await handleUpdateEvent({
            ...task,
            date: dateProps.value.toLocaleDateString(),
            star: {
                ...task.star,
                date: getFormatDateParam(dateProps.value)
            },
            end: {
                ...task.end,
                date: getFormatDateParam(dateProps.value)
            }
        }, null, `¿Desea mover la tarea "${task.title}" a la fecha ${transformStringToDate(props.fecha)}?`)
    }
}

watchEffect(() => {
    dateProps.value = transformStringToDateObject(props.fecha)
    tasks.value = filterForDate(dateProps.value.toLocaleDateString())
})

</script>

<template>
    <div>
        <div class="flex flex-col justify-start items-center">
            <p>{{ transformArrayStringToNumber(props.fecha, '/')[0] }}</p>
        </div>
        <div class="flex flex-col justify-start items-center h-20 " @dragover.prevent @drop.prevent="updateForDate">
            <itemTask v-for="task in tasks" :task="task" :date="(transformStringToDateObject(task.date))" :key="task.uid" />
        </div>
        <div class="
            w-full
            my-2
            text-end">
            <button
                class="bg-blue-500 px-1 mr-1 rounded-full text-black shadow-md hover:bg-blue-700 transition duration-300 ease-in-out hover:text-white"
                title="Agregar tarea">
                <i class='bx bxs-calendar-plus' @click="toggleModalState"></i>
            </button>
            <button
                class="bg-blue-300 px-1 mr-1 rounded-full text-black shadow-md hover:bg-blue-600 transition duration-300 ease-in-out hover:text-white"
                :title="`Ver eventos y tareas del dia ${transformStringToDate(props.fecha)}`"
                @click="redirect.push(`/day/${props.fecha.split('/').join('-')}`)">
                <i class='bx bxs-calendar-star' @click="toggleModalState"></i>
            </button>
        </div>
        <div>
        </div>
    </div>
    <taskModal :showModal="modalState" :date="dateProps" @update:showModal="toggleModalState" />
</template>

<style></style>
