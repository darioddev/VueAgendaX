<script setup lang="ts">
import useEventAction from '@/composables/useEventAction'

import type { TaskModelProps } from '@/interfaces/taskModelProps'
import type { taskModalProps } from '@/interfaces/taskModalProps'
import { TaskType } from '@/interfaces/types'
import { ref, watch, nextTick } from 'vue'
import { getTimeFormat, getFormatDateParam, transformDateToDateInfo, checkDate } from '@/utils/date'
import { generateColor } from '@/utils/uuid'

const props = defineProps<taskModalProps>()
const showModal = ref<boolean>(props.showModal)
const inputTitleEvent = ref<HTMLInputElement | null>(null)

const {
    errorMessage, // Mensaje de error
    submitEvent: handleSubmitEvents, // Funcion para enviar los datos al servidor
    isSuccessMutation,
    deleteEvent: handleRemoveEvent
} = useEventAction() // Acciones para enviar los datos al servidor


const emit = defineEmits(['update:showModal'])
const closeModal = () => emit('update:showModal', !showModal.value)
const task = ref<TaskModelProps>(props.task ?? {
    type: TaskType.EVENTO,
    title: '',
    date: props.date.toLocaleDateString(),
    star: {
        date: getFormatDateParam(props.date),
        time: getTimeFormat(new Date().getHours() + 1),
        allDay: false
    },
    end: {
        date: getFormatDateParam(props.date),
        time: getTimeFormat(new Date().getHours() + 2) || '00:00'
    },
    color: {
        background: generateColor(),
        text: '#000000'
    },
    description: ''
})

const focusEvent = (typeEvent: string) => task.value.type.toLowerCase() === typeEvent.toLowerCase() ? 'bg-gray-200' : ''

const resetValues = (): void => {
    task.value = {
        type: TaskType.EVENTO,
        title: '',
        date: props.date.toLocaleDateString(),
        star: {
            date: getFormatDateParam(props.date),
            time: getTimeFormat(new Date().getHours() + 1),
            allDay: false
        },
        end: {
            date: getFormatDateParam(props.date),
            time: getTimeFormat(new Date().getHours() + 2)
        },
        color: {
            background: generateColor(),
            text: '#000000'
        },
        description: ''
    }
}

watch(() => task.value.star.date, (value) => {
    task.value = {
        ...task.value,
        date: new Date(value).toLocaleDateString(),
        star: {
            ...task.value.star,
            date: checkDate(value) || getFormatDateParam(props.date)
        },
        end: {
            ...task.value.end,
            date: checkDate(value) || getFormatDateParam(props.date)
        }
    };
});


watch(() => task.value.end.date, (value) => {
    task.value = {
        ...task.value,
        end: {
            ...task.value.end,
            date: checkDate(value) || getFormatDateParam(props.date)
        }
    };
});

watch(() => props.date, (value: Date) => {
    const dateValue = value instanceof Date ? value : new Date(value)
    const formattedDate = dateValue.toLocaleDateString()
    task.value = {
        ...task.value,
        date: formattedDate,
        star: {
            ...task.value.star,
            date: getFormatDateParam(dateValue)
        },
        end: {
            ...task.value.end,
            date: getFormatDateParam(dateValue)
        }
    };
});


watch(() => props.showModal, async (value: boolean) => {
    showModal.value = value // Actualizo el valor de la variable reactiva showModal con el valor de la prop showModal
    if (value) { // Si es verdadero , el modal se muestra
        await nextTick(); // Espera a que el DOM se actualice para enfocar el input
        inputTitleEvent.value?.focus(); // Enfoco el input
    }
    // Si no hay un id, reseteo los valores , esto es por que el id nos la proporciona el servidor , y si no hay id es por que es un nuevo evento
    if (!task.value?.id) resetValues()
    // Si hay un id , busco la tarea por el id y la asigno a la variable reactiva task , esto es por que el id nos la proporciona el servidor
    // Esto sirve para cuando el usuario si entra al modal cambia los parametros de la tarea y luego cierra el modal,
    // Y no ha guardado los cambios , al volver a abrir el modal , se vuelve a asignar los valores de la tarea
    if (task.value?.id) task.value = props.task as TaskModelProps

})



/*
watch(() => props.task, (value: TaskModelProps | undefined) => {
    if (value) {
        task.value = value
    }
}, { immediate: true, })
*/
</script>
<template>
    <div id="crud-modal" tabindex="-1" aria-hidden="true"
        class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        v-if="showModal">
        <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow ">
                <div class="flex items-center justify-between p-2 md:p-2 border-b rounded-t ">
                    <button type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-5 h-5 ms-auto inline-flex justify-center items-center "
                        data-modal-toggle="crud-modal" @click="closeModal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <form class="p-4 md:p-5" @submit.prevent="handleSubmitEvents(task, closeModal)">
                    <div class="grid gap-4 mb-4 grid-cols-2">
                        <div class="col-span-2 flex items-center justify-center" v-if="errorMessage.trim()">
                            <i class='bx bxs-error text-red-600 mx-1'></i>
                            <p class="text-red-600 text-sm font-medium">{{ errorMessage }}</p>
                        </div>
                        <div class="col-span-2 flex items-center justify-start" v-if="isSuccessMutation">
                            <div class="flex items-center gap-2">
                                <i class='bx bx-loader-alt bx-spin text-blue-500'></i>
                                <p class="text-blue-500 text-sm font-medium">Guardando...</p>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <input type="text" name="name" id="name" ref="inputTitleEvent"
                                class="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Añade un titulo para el evento" title="Añade un titulo para el evento"
                                v-model="task.title">
                            <p class="text-xs text-gray-400 text-start ml-1" v-if="task.dateModified">Ultima modificacion:
                                {{ transformDateToDateInfo(new Date(task.dateModified)) }}
                                {{ new Date(task.dateModified).toLocaleTimeString() }}
                            </p>
                        </div>
                        <div class="col-span-2">
                            <div class="flex items-start justify-start gap-1" title="Tipo de evento">
                                <button type="button"
                                    class="text-black hover:bg-gray-200 font-medium text-sm px-3 py-1 text-center"
                                    :class="focusEvent(TaskType.TAREA)" @click="task.type = TaskType.TAREA">
                                    {{ TaskType.TAREA }}
                                </button>
                                <button type="button"
                                    class="text-black hover:bg-gray-200 font-medium  text-sm px-3 py-1 text-center"
                                    :class="focusEvent(TaskType.EVENTO)" @click="task.type = TaskType.EVENTO">
                                    {{ TaskType.EVENTO }}
                                </button>
                            </div>
                        </div>
                        <div class="flex flex-col col-span-2 sm:col-span-1" title="Fecha de inicio y fin">
                            <div class="flex flex-col items-start">
                                <div
                                    class="flex flex-row items-center gap-2 w-full bg-gray-50 rounded-lg focus:ring-primary-600 focus:border-primary-600 my-2 ">
                                    <div>
                                        <i class="bx bx-time text-gray-600 mx-1 pt-1"></i>
                                    </div>
                                    <div>
                                        <input type="date"
                                            class="w-full p-1 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                                            v-model="task.star.date">
                                    </div>
                                    <div>
                                        <input type="time"
                                            class="w-full p-1 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                                            v-if="!task.star.allDay" v-model="task.star.time">
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2 w-full bg-gray-50 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                                    v-if="task.type === TaskType.EVENTO && !task.star.allDay">
                                    <div>
                                        <i class="bx bxs-stopwatch text-gray-600 mx-1 pt-1"></i>
                                    </div>

                                    <div>
                                        <input type="date"
                                            class="w-full p-1 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                                            v-model="task.end.date">
                                    </div>
                                    <div>
                                        <input type="time"
                                            class="w-full p-1 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                                            v-model="task.end.time">
                                    </div>
                                </div>
                            </div>
                            <div
                                class="flex items-center gap-2 mt-2 justify-start w-full bg-gray-50 rounded-lg focus:ring-primary-600 focus:border-primary-600">
                                <div>
                                    <i class='bx bxs-timer text-gray-600 mx-1 pt-1'></i>
                                </div>
                                <div>
                                    <input type="checkbox" name="allDay" id="allDay"
                                        class="w-4 h-4 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 cursor-pointer"
                                        :checked="task.star.allDay" @click="task.star.allDay = !task.star.allDay">
                                </div>
                                <div class="flex justify-center items-center">
                                    <label for="allDay" class="text-sm text-gray-400">
                                        Todo el día
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>
                        <div class="col-span-2">
                            <div class="flex flex-row items-center gap-2 w-full bg-gray-50 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                                title="Color de fondo">
                                <div>
                                    <i class="bx bxs-paint text-gray-600 mx-1 pt-1"></i>
                                </div>
                                <div class="w-full">
                                    <input type="color" name="backgroundColor" id="backgroundColor"
                                        class="w-full h-4 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 cursor-pointer"
                                        v-model="task.color.background">
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2 w-full bg-gray-50 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                                title="Color de texto">
                                <div>
                                    <i class="bx bx-font-color text-gray-600 mx-1 pt-1"></i>
                                </div>
                                <div class="w-full">
                                    <input type="color" name="textColor" id="textColor" class="w-full h-4 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600
                                        cursor-pointer" v-model="task.color.text">
                                </div>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <div class="flex flex-row ">
                                <i class="bx bx-align-justify text-gray-600 mx-1 pt-1"></i>
                                <textarea id="description" rows="4"
                                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Añade una descripcion" v-model="task.description"
                                    title="Añade una descripcion"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="text-end">
                        <button type="submit"
                            class="text-white text-sm font-medium rounded-lg px-3 py-1 hover:bg-blue-700 transition duration-300 ease-in-out"
                            :class="{
                                'bg-blue-500': !task.id,
                                'bg-green-700': task.id,
                                'mx-1': task.id
                            }"
                            :title="task.id ? 'Guardar cambios' : `Guardar evento para el dia ${transformDateToDateInfo(new Date(task.date))}`">
                            <i :class="task.id ? 'bx bx-rename' : 'bx bxs-save'"></i>
                        </button>
                        <button type="button" v-if="task.id"
                            class="bg-red-500 text-white text-sm font-medium rounded-lg px-3 py-1 hover:bg-red-700 transition duration-300 ease-in-out"
                            @click="handleRemoveEvent(task?.id as number, closeModal)" title="Borrar evento">
                            <i class='bx bxs-trash'></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>