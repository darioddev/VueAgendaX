<script setup lang="ts">
import headerNav from '@/components/headerNav.vue'
import itemTask from '@/components/itemTask.vue'
import useEventsStore from '@/stores/events'

import { transformStringToDateObject } from '@/utils/date'
import { TaskType } from '@/interfaces/types'
import { reactive, ref, watch, onMounted } from 'vue'
import type { TaskModelProps } from '@/interfaces/taskModelProps'

const task = ref<string>(TaskType.TODOS)
const taks = reactive<TaskModelProps[]>([])

const eventsStore = useEventsStore()
const { events } = eventsStore
const focus = (taskTpe: string) => (task.value === taskTpe) ? 'bg-gray-300' : ''

watch(task, (newValue) => {
    taks.length = 0;
    if (newValue === TaskType.TODOS) {
        events.forEach((event: TaskModelProps) => {
            taks.push(event);
        });
    }
    if (newValue !== TaskType.TODOS) {
        eventsStore.getEventsByType(newValue).forEach((event: TaskModelProps) => {
            taks.push(event);
        });
    }
});

onMounted(() => {
    events.forEach((event: TaskModelProps) => {
        taks.push(event);
    });
});
</script>
<template>
    <headerNav />

    <div class="pt-20">
        <div class="flex items-center justify-start mx-2">
            <h1 class="text-2xl font-bold text-blue-600">Mis tareas</h1>
        </div>
        <div class="flex items-center justify-start gap-2 mx-2">
            <button class="px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300
            transition duration-300 ease-in-out" type="button" @click="task = TaskType.TODOS"
                :class="focus(TaskType.TODOS)">{{ TaskType.TODOS }}</button>
            <button class="px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300
            transition duration-300 ease-in-out" type="button" @click="task = TaskType.TAREA"
                :class="focus(TaskType.TAREA)">{{ TaskType.TAREA }} </button>
            <button class="px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300
            transition duration-300 ease-in-out" type="button" @click="task = TaskType.EVENTO"
                :class="focus(TaskType.EVENTO)">{{ TaskType.EVENTO }}</button>
        </div>
        <div class="flex flex-col items-center justify-center gap-2 mt-4">
            <!-- Contenedor dicinedo si no hay tareas o eventos -->
            <div v-if="taks.length === 0" class="flex flex-col items-center justify-center gap-2">
                <!-- Mensaje diciendo que no se ha encontrado datos -->
                <p class="text-gray-500 font-medium">No se han encontrado {{ (task !== TaskType.TODOS) ? task.toLowerCase()
                    : 'datos' }}</p>
            </div>
            <itemTask v-for="task in taks" :task="task" :date="(transformStringToDateObject(task.date))" :key="task.uid" />
        </div>

    </div>
</template>

<style scoped></style>
