<script setup lang="ts">
import calendarMonth from '@/components/calendarMonth.vue';
import taskModal from '@/components/taskModal.vue';
import headerNav from '@/components/headerNav.vue';
import useDate from '@/composables/useDate';
import useEventsStore from '@/stores/events';
import useModal from '@/composables/useModal';
import useEventAction from '@/composables/useEventAction';
import { transformDateToDateInfo } from '@/utils/date'
import { capitalize, createArray } from '@/utils/arrayString'
import { ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'


interface objectOptions {
    text: string,
    start: number,
    end: number,
    indexs: Array<number>
}

interface dayOfWeekProps {
    id: number
    language: string,
    days: Array<string>
    positionSaturday: number
    positionSunday: number
}

const { date, nextMonth, nextYear, monthCurrent, yearCurrent, dayToday } = useDate(new Date())
const { showModal, toggleModalState } = useModal()
const { deleteEvent: handleRemoveEvent } = useEventAction()

const { loading } = storeToRefs(useEventsStore())
const daysOfWeek: Array<String> = import.meta.env.VITE_DAYS_OF_WEEK_ES.split(',')
const controlYear = () => {
    if (yearCurrent.value < 1900 || yearCurrent.value > 2100) {
        yearCurrent.value = date.value.getFullYear()
    }
    nextYear(yearCurrent.value - date.value.getFullYear())
}
const ncols = ref<number[]>(createArray(daysOfWeek.length))
const selectedOption = ref<number>(0)
const nmonths = ref<number>(1)
const daysOfWeeks = ref<dayOfWeekProps>(
    {
        id: 0,
        language: 'es-ES',
        days: daysOfWeek as Array<string>,
        positionSaturday: daysOfWeek.length - 2,
        positionSunday: daysOfWeek.length - 1
    })

const getIndexrOfDays = (star: number, end: number) => {
    return createArray(daysOfWeek.length).slice(star, end)
}

const selectOptions: objectOptions[][] = [
    [{ text: 'Todos los dias', start: daysOfWeek.length - 7, end: daysOfWeek.length, indexs: getIndexrOfDays(0, daysOfWeek.length) },
    { text: 'Lunes a viernes', start: 0, end: daysOfWeek.length - 2, indexs: getIndexrOfDays(0, daysOfWeek.length - 2) },

    { text: 'Lunes, Miercoles y Viernes', start: 0, end: daysOfWeek.length - 2, indexs: getIndexrOfDays(0, daysOfWeek.length - 2).filter((el, index) => index % 2 === 0) },
    { text: 'Martes a Jueves', start: 1, end: daysOfWeek.length - 3, indexs: getIndexrOfDays(1, daysOfWeek.length - 3) },
    { text: 'Fines de semana', start: daysOfWeek.length - 2, end: daysOfWeek.length, indexs: getIndexrOfDays(daysOfWeek.length - 2, daysOfWeek.length) },
    { text: '3 primeros dias', start: 0, end: daysOfWeek.length - 4, indexs: getIndexrOfDays(0, daysOfWeek.length - 4) },
    { text: '3 ultimos dias', start: daysOfWeek.length - 3, end: daysOfWeek.length, indexs: getIndexrOfDays(daysOfWeek.length - 3, daysOfWeek.length) }]
    ,
    [{ text: 'All days', start: 0, end: daysOfWeek.length, indexs: getIndexrOfDays(0, daysOfWeek.length) },
    { text: 'Monday, Wednesday and Friday', start: 0, end: daysOfWeek.length - 2, indexs: getIndexrOfDays(0, daysOfWeek.length - 1).filter((el, index) => index % 2 !== 0) },
    { text: 'Monday to Friday', start: 0, end: daysOfWeek.length - 2, indexs: getIndexrOfDays(1, daysOfWeek.length - 1) },
    { text: 'Tuesday to Thursday', start: 1, end: daysOfWeek.length - 3, indexs: getIndexrOfDays(2, daysOfWeek.length - 2) },
    { text: 'Weekend', start: daysOfWeek.length - 2, end: daysOfWeek.length, indexs: [0, ...getIndexrOfDays(daysOfWeek.length - 1, daysOfWeek.length)] },
    { text: 'First 3 days', start: 0, end: daysOfWeek.length - 4, indexs: getIndexrOfDays(0, daysOfWeek.length - 4) },
    { text: 'Last 3 days', start: daysOfWeek.length - 3, end: daysOfWeek.length, indexs: getIndexrOfDays(daysOfWeek.length - 3, daysOfWeek.length) }
    ]
]


const handleSelect = () => {
    const { start, end, indexs } = selectOptions[daysOfWeeks.value.id][selectedOption.value]
    //ncols.value = createArray(props.cols).slice(start, end)
    ncols.value = indexs
}



const handleSelectLanguage = () => {
    daysOfWeeks.value.days = daysOfWeeks.value.id === 1 ?
        daysOfWeeks.value.days = import.meta.env.VITE_DAYS_OF_WEEK_EN.split(',')
        : daysOfWeeks.value.days = import.meta.env.VITE_DAYS_OF_WEEK_ES.split(',')

    if (daysOfWeeks.value.id === 1) {
        daysOfWeeks.value.language = 'en-US'
        daysOfWeeks.value.positionSaturday = daysOfWeeks.value.days.length - 1
        daysOfWeeks.value.positionSunday = 0
    } else {
        daysOfWeeks.value.language = 'es-ES'
        daysOfWeeks.value.positionSaturday = daysOfWeeks.value.days.length - 2
        daysOfWeeks.value.positionSunday = daysOfWeeks.value.days.length - 1
    }
}


watch(() => nmonths, (value) => {
    console.log(nmonths.value)
    console.log(value.value)
}, { immediate: true })



</script>

<template>
    <div class="pt-20">
        <headerNav />
        <div class="flex flex-row items-star justify-star  gap-2 w-full px-4">
            <select name="months" id="months" v-model="monthCurrent"
                @change="nextMonth(monthCurrent - date.getMonth() - 1)"
                class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg">
                <option v-for="month in 12" :key="month" :value="month" :selected="month === date.getMonth() + 1"
                    :title="`Seleccionar el mes de ${new Date(date.getFullYear(), month - 1).toLocaleString('es-ES', { month: 'long' })}`">
                    {{ capitalize(new Date(date.getFullYear(), month - 1).toLocaleString('es-ES', { month: 'long' })) }}
                </option>
            </select>
            <input type="number" min="1900" max="2100"
                class="w-20 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
                v-model="yearCurrent" @input="controlYear">

            <select name="daysOfWeek" id="daysOfWeek"
                class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
                v-model="daysOfWeeks.id" @change="handleSelectLanguage">
                <option :value=0>Español</option>
                <option :value=1>Ingles</option>
            </select>

            <!-- 
            <select name="months" id="months" v-model="nmonths" 
                class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg">
                <option v-for="month in 12 " :key="month">
                    {{ month }}
                </option>
            </select>
        -->
        </div>
        <div class="flex justify-between items-center px-4 mb-2"
            :class="{ 'opacity-20': loading, 'pointer-events-none': loading }">
            <div class="flex items-center"> <!-- Este div contiene los botones de navegación -->
                <button @click="dayToday"
                    class="p-1 py-2 text-black rounded-lg flex items-center justify-center shadow-md transition duration-300 ease-in-out border border-gray-500 hover:bg-blue-700 hover:text-white"
                    :title="`Hoy es ${transformDateToDateInfo(new Date())}`">
                    <i class='bx bxs-calendar'></i>
                    Hoy
                </button>
                <button @click="nextMonth(-1)"
                    class="p-1 py-2 ml-4  text-black  flex items-center justify-center transition duration-300 ease-in-out bg-none hover:bg-gray-200 hover:text-white">
                    <i class='bx bxs-chevron-left'
                        :title="`Mes anterior: ${capitalize(new Date(date.getFullYear(), date.getMonth() - 1).toLocaleString('es-ES', { month: 'long' }))} de ${new Date(date.getFullYear(), date.getMonth() - 1).getFullYear()}`"></i>
                </button>
                <button @click="nextMonth(1)"
                    class="p-1 py-2 text-black flex items-center justify-center transition duration-300 ease-in-out  hover:bg-gray-200 hover:text-white"
                    :title="`Mes siguiente: ${capitalize(new Date(date.getFullYear(), date.getMonth() + 1).toLocaleString('es-ES', { month: 'long' }))} de ${new Date(date.getFullYear(), date.getMonth() + 1).getFullYear()}`">
                    <i class='bx bxs-chevron-right'></i>
                </button>
                <h3 class="text-4xl font-bold pb-1 text-blue-700 cursor-pointer">{{
                capitalize(date.toLocaleString(`${daysOfWeeks.language}`,
                    {
                        month:
                            'long'
                    })) }}
                    {{ daysOfWeeks.language === 'es-ES' ? 'de' : 'of' }} {{ date.getFullYear() }}</h3>
            </div>
            <div class="flex items-center">
                <div class="flex flex-row ml-auto">
                    <select class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out mr-2
                    cursor-pointer rounded-lg" v-model="selectedOption" @change="handleSelect"
                        title="Seleccionar dias a mostrar">
                        <option disabled>Mostrar por dias especificos...</option>
                        <option v-for="(option, index) in selectOptions[daysOfWeeks.id]" :key="index" :value="index"> {{
                option.text }}
                        </option>
                    </select>
                    <button
                        class="bg-blue-500 px-2 mr-1 rounded-full text-black shadow-md hover:bg-blue-700 transition duration-300 ease-in-out hover:text-white"
                        title="Agregar tarea" @click="toggleModalState">
                        <i class='bx bxs-calendar-plus bx-sm'></i>
                    </button>
                    <button
                        class="bg-red-300 px-2  mr-1 rounded-full py-1 text-black shadow-md hover:bg-red-600 transition duration-300 ease-in-out hover:text-white transform hover:-translate-y-1"
                        title="Papelera de reciclaje" @dragover.prevent
                        @drop.prevent="handleRemoveEvent(Number($event.dataTransfer?.getData('text/plain')))">
                        <i class='bx bxs-trash bx-flip-horizontal bx-sm'></i>
                    </button>
                </div>
            </div>
        </div>
        <slot name="error"></slot>
        <calendarMonth 
        :lang="daysOfWeeks.language" 
        :month="monthCurrent" 
        :year="yearCurrent" 
        :cols="ncols"
        :daysOfWeek="daysOfWeeks.days" 
        @update:month="nextMonth"
            />
        <!-- Contenedor que implica que estara en una fila solo 3 elementos de cada calendario
        <div class="flex flex-row flex-wrap gap-4">
            <calendarMonth v-for="month in Number(nmonths)" :key="month" :month="month" :year="yearCurrent" :cols="ncols">
                <template #month>
                    <h3 class="text-2xl font-bold text-blue-700 cursor-pointer">{{ capitalize(new Date(yearCurrent,
                        month - 1).toLocaleString(`${daysOfWeeks.language}`, { month: 'long' })) }}</h3>
                </template>
</calendarMonth>
</div>
-->
    </div>
    <taskModal :showModal="showModal" :date="new Date()" @update:showModal="toggleModalState" />
</template>


<style scoped></style>