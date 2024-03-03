<script setup lang="ts">
import headerNav from '@/components/headerNav.vue'
import itemTask from '@/components/itemTask.vue'
import useEventsStore from '@/stores/events'
import { transformStringToDateObject } from '@/utils/date'
import { TaskType, Ordentaion } from '@/interfaces/types'
import { storeToRefs } from 'pinia'
import { reactive, ref, watchEffect } from 'vue'
import type { TaskModelProps } from '@/interfaces/taskModelProps'
const task = ref<string>(TaskType.TODOS)
const tasks = reactive<TaskModelProps[]>([])
const handleSelect = ref<string>('')
const typeOrder = ref<boolean>(true)
const store = useEventsStore()
const { events, loading } = storeToRefs(store)

const focus = (taskTpe: string) => (task.value === taskTpe) ? 'bg-gray-300' : ''

watchEffect(() => {
    tasks.length = 0;
    if (task.value === TaskType.TODOS && !handleSelect.value) {
        events.value.forEach((event: TaskModelProps) => {
            tasks.push(event);
        });
    }
    if (task.value !== TaskType.TODOS && !handleSelect.value) {
        store.getEventsByType(task.value).forEach((event: TaskModelProps) => {
            tasks.push(event);
        });
    }

});

</script>
<template>
    <headerNav />
    <div class="pt-20" :class="{ 'opacity-15': loading, 'pointer-events-none': loading }">
        <slot name="error"></slot>
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
        <div class="flex flex-row flex-wrap mx-2 items-center justify-center gap-2 mt-4" v-if="!loading">
            <!-- Contenedor dicinedo si no hay tareas o eventos -->
            <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center gap-2">
                <!-- Mensaje diciendo que no se ha encontrado datos -->
                <p class="text-gray-500 font-medium">No se han encontrado {{ (task !== TaskType.TODOS) ? task.toLowerCase()
                    : 'datos' }}</p>
            </div>
            <!-- Contenedor con Select de ordenacion 
            <div class="flex flex-row items-center justify-start gap-2 w-full">
                <select name="order" id="order"
                    class="px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out"
                    v-model="handleSelect">
                    <option value="" disabled>Ordenar por...</option>
                    <option v-for="order in Object.values(Ordentaion)" :key="order" :value="order">{{ order }}</option>
                </select>
                <select name="order" id="order"
                    class="px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out"
                    v-model="typeOrder">
                    <option :value="true">Ascendente</option>
                    <option :value="false">Descendente</option>
                </select>
                <input type="text" class="w-1/2 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-200
                transition duration-300 ease-in-out" placeholder="Buscar..." 
                />
            </div>
            -->
            <itemTask v-for="task in tasks" :task="task" :date="(transformStringToDateObject(task.date))" :key="task.uid"
                :personalized="true">
            </itemTask>
        </div>
    </div>
    <slot name="loading"></slot>
</template>

<style scoped></style>
