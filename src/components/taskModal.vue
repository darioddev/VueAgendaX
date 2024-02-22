<script setup lang="ts">
import type { TaskModelProps, taskModalProps } from '@/interfaces/calendar'
import { TaskType } from '@/interfaces/types'
import { ref, watch, nextTick } from 'vue'
//import { postEvent } from '@/composables/useEvent'
import { useAddEvent } from '@/composables/useEvent'
//import { hasEmptyDataObject } from '@/utils/arrayString'
import { getTimeFormat, getFormatDateParam, transformDateToDateInfo, checkDate } from '@/utils/date'
import { generateUUID, generateColor } from '@/utils/uuid'

//import { post } from '@/utils/request'

const props = withDefaults(defineProps<taskModalProps>(), {
    showModal: false
})
const showModal = ref<boolean>(props.showModal)
const errorMessage = ref<string>('')
const inputTitleEvent = ref<HTMLInputElement | null>(null)
const {
    isSuccess: isSuccessMutation,
    mutateAsync: pushEvent
} = useAddEvent()

const emit = defineEmits(['update:showModal'])
const closeModal = () => emit('update:showModal', !showModal.value)
const task = ref<TaskModelProps>(
    props.task ?? {
        type: TaskType.EVENTO,
        title: '',
        date: props.date,
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
    })

watch(() => task.value.star.date, (value) => {
    task.value.star.date = checkDate(value) || getFormatDateParam(props.date)
})

watch(() => task.value.end.date, (value) => task.value.end.date = checkDate(value) || getFormatDateParam(props.date))
watch(() => props.showModal, async (value) => {
    showModal.value = value // Actualizo el valor de la variable reactiva showModal con el valor de la prop showModal
    if (value) { // Si es verdadero , el modal se muestra
        await nextTick(); // Espera a que el DOM se actualice para enfocar el input
        inputTitleEvent.value?.focus(); // Enfoco el input
    }
    if (!task.value?.uid) resetValues() // Si no hay un uid, reseteo los valores

})


watch(() => props.date, (value) => {
    task.value.date = value
    task.value.star.date = getFormatDateParam(value)
    task.value.end.date = getFormatDateParam(value)
},)


const focusEvent = (typeEvent: string) => task.value.type.toLowerCase() === typeEvent.toLowerCase() ? 'bg-gray-200' : ''


const handleSubmitEvents = async () => {
    try {
        /*
        //Excepcion general para evitar enviar datos vacios
        if (hasEmptyDataObject(task.value)) throw new Error('No se puede enviar datos vacios')
        */
        if (!task.value.title.trim()) throw new Error('El titulo no puede estar vacio')
        const data: TaskModelProps = { uid: generateUUID(), ...task.value }
        //await post(import.meta.env.VITE_API_URL_EVENTOS as string, data)
        //await postEvent(data)
        await pushEvent(data)
        await new Promise((resolve) => setTimeout(resolve, 1000)) //Simulo un tiempo de espera
        closeModal()
    } catch (error) {
        if (error instanceof Error) errorMessage.value = error.message
        else errorMessage.value = 'Algo ha salido mal'
    }
}

const resetValues = () => {
    errorMessage.value = ''
    task.value = {
        type: TaskType.EVENTO,
        title: '',
        date: props.date,
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
            text: (task.value.color.background === '#000000') ? '#FFFFFF' : '#000000'
        },
        description: ''
    }
}


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
                <form class="p-4 md:p-5" @submit.prevent="handleSubmitEvents">
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
                            class="bg-blue-500 text-white text-sm font-medium rounded-lg px-3 py-1 hover:bg-blue-700 transition duration-300 ease-in-out"
                            :title="`Guardar evento para el dia ${transformDateToDateInfo(new Date(task.date))}`
                                ">
                            <i class='bx bxs-save'></i>
                        </button>
                        <button type="button"
                            v-if="task.uid"
                            class="bg-green-700 text-white text-sm font-medium rounded-lg px-3 py-1 mx-1 hover:bg-green-800 transition duration-300 ease-in-out"
                            @click="closeModal" title="Guardar cambios">
                            <i class='bx bx-rename'></i>
                        </button>
                        <button type="button"
                            v-if="task.uid"
                            class="bg-red-500 text-white text-sm font-medium rounded-lg px-3 py-1 hover:bg-red-700 transition duration-300 ease-in-out"
                            @click="closeModal" title="Borrar evento">
                            <i class='bx bxs-trash'></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>