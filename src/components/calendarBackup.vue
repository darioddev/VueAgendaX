<script setup lang="ts">
import ceillCalendar from '@/components/ceillCalendar.vue'
import useEventsStore from '@/stores/events'
import useModal from '@/composables/useModal'
import taskModal from '@/components/taskModal.vue'
import useEventAction from '@/composables/useEventAction'
import useDate from '@/composables/useDate'


import type { CalendarProps } from '@/interfaces/calendarProps'
import { transformDateToDateInfo } from '@/utils/date'
import { createArray, transformArrayStringToNumber, capitalize } from '@/utils/arrayString'
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

interface objectOptions {
    text: string,
    start: number,
    end: number
}


const props = withDefaults(defineProps<CalendarProps>(), {
    daysOfWeek: () => import.meta.env.VITE_DAYS_OF_WEEK_ES.split(',') as Array<string>,
    cols: Number(import.meta.env.VITE_CALENDAR_COLS_DEFAULT) as number,
    rows: Number(import.meta.env.VITE_CALENDAR_ROWS_DEFAULT) as number,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
})

const tablamonth = ref<string[][]>([])

const { date, monthCurrent, yearCurrent, nextMonth, nextYear, dayToday, setYear, setMonth, setDate } = useDate(new Date(props.year, props.month - 1))
const { showModal, toggleModalState } = useModal()
const { deleteEvent: handleRemoveEvent } = useEventAction()
const { loading } = storeToRefs(useEventsStore())

const anadevalorSecuencial = (numero: number, valor: string, celdas: string[][]) => {
    const fila = Math.floor(numero / props.daysOfWeek.length);
    const columna = numero % props.daysOfWeek.length;
    celdas[fila][columna] = valor;
}

const calcularTablamonth = () => {
    const celdas: string[][] = Array.from(Array(props.daysOfWeek.length).keys()).map(() => Array.from(Array(props.rows).keys()).map(() => ''))
    const primerDia: Date = new Date(`${date.value.getFullYear()}-${date.value.getMonth() + 1}-01`)
    const posicionPrimerDia = transformArrayStringToNumber(import.meta.env.VITE_INDEX_FOR_DAY_ES as string)[primerDia.getDay()]
    const numDiasmonth: number = new Date(date.value.getFullYear(), date.value.getMonth() + 1, 0).getDate()
    const rangoNumeros: Array<number> = createArray(numDiasmonth).map(i => i + posicionPrimerDia || 0)
    rangoNumeros.map((el, index): void => anadevalorSecuencial(el, new Date(date.value.getFullYear(), date.value.getMonth(), (index + 1)).toLocaleDateString(), celdas))
    tablamonth.value = celdas
}


watchEffect(
    () => {
        calcularTablamonth()
        console.log()
        setDate(new Date(date.value.getFullYear(), date.value.getMonth(), 1))
        //setMonth(date.value.getMonth() + 1)
        //setYear(date.value.getFullYear())
    }
)

//********************************************************** */
const ncols = ref<number[]>(createArray(props.cols as number))
const selectedOption = ref<number>(0)


const selectOptions: Array<objectOptions> = [
    { text: 'Todos los dias', start: props.daysOfWeek.length - 7, end: props.daysOfWeek.length },
    { text: 'Lunes, Miercoles y Viernes', start: 0, end: props.daysOfWeek.length - 2 },
    { text: 'Lunes a viernes', start: 0, end: props.daysOfWeek.length - 2 },
    { text: 'Martes a Jueves', start: 1, end: props.daysOfWeek.length - 3 },
    { text: 'Fines de semana', start: props.daysOfWeek.length - 2, end: props.daysOfWeek.length },
    { text: '3 primeros dias', start: 0, end: props.daysOfWeek.length - 4 },
    { text: '3 ultimos dias', start: props.daysOfWeek.length - 3, end: props.daysOfWeek.length }
]


const handleSelect = () => {
    const { start, end } = selectOptions[selectedOption.value]
    ncols.value = createArray(props.daysOfWeek.length).slice(start, end)

    if (selectedOption.value === 1) {
        ncols.value = ncols.value.filter((el, index) => index % 2 === 0)
    }
}


let timeout: ReturnType<typeof setTimeout> | null = null;
const nextMonthWithDelay = (event: DragEvent) => {
    event.preventDefault()
    const x = event.clientX

    if ((x < 50 || x > window.innerWidth - 50) &&
        event.dataTransfer?.types.includes('text/plain')) {
        if (!timeout) {
            timeout = setTimeout(() => {
                nextMonth(x < 50 ? -1 : 1)
                timeout = null
            }, 500)
        }
    } else {
        clearTimeout(timeout as ReturnType<typeof setTimeout>)
        timeout = null
    }
}

/*
const controlYear = () => {
    if (yearCurrent.value < 1900 || yearCurrent.value > 2100) {
        yearCurrent.value = date.value.getFullYear()
    }
    nextYear(yearCurrent.value - date.value.getFullYear())
}
*/
//******************************************************************** */
//const date = ref<Date>(new Date(props.year, props.month - 1))
//const monthCurrent = ref<number>(date.value.getMonth() + 1)
//const yearCurrent = ref<number>(date.value.getFullYear())
//const nextMonth = (n: number): Date => date.value = new Date(date.value.getFullYear(), date.value.getMonth() + n, 1)
//const nextYear = (n: number): Date => date.value = new Date(date.value.getFullYear() + n, date.value.getMonth(), 1)
//const dayToday = (): Date => date.value = new Date()
</script>

<template>
    <div class="flex justify-between items-center px-4 mb-2"
        :class="{ 'opacity-20': loading, 'pointer-events-none': loading }">
        <div class="flex items-center">
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
            <h3 class="text-4xl font-bold pb-1 text-blue-700 cursor-pointer">{{ capitalize(date.toLocaleString('es-ES',
            {
                month:
                    'long'
            })) }}
                de {{ date.getFullYear() }}</h3>
        </div>
        <div class="flex items-center">
            <div class="flex flex-row ml-auto">
                <select class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out mr-2
                    cursor-pointer rounded-lg" v-model="selectedOption" @change="handleSelect"
                    title="Seleccionar dias a mostrar">
                    <option disabled>Mostrar por dias especificos...</option>
                    <option v-for="(option, index) in selectOptions" :key="index" :value="index"> {{ option.text }}
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
    <slot name="loading"></slot>
    <div class="h-screen w-full flex flex-row" :class="{ 'opacity-20': loading, 'pointer-events-none': loading }"
        @dragover.prevent="nextMonthWithDelay">
        <!-- boton con felcha-
        <button @click="nextMonth(-1)"
            class="p-1 py-2 ml-2 h-auto text-black  flex items-center justify-center transition duration-300 ease-in-out bg-none hover:bg-gray-200 hover:text-white">
            <i class='bx bxs-chevron-left'
                :title="`Mes anterior: ${capitalize(new Date(date.getFullYear(), date.getMonth() - 1).toLocaleString('es-ES', { month: 'long' }))} de ${new Date(date.getFullYear(), date.getMonth() - 1).getFullYear()}`"></i>
        </button>
    -->
        <table class="table-auto border-collapse border w-full h-screen mx-4">
            <thead>
                <tr>
                    <th v-for="c in ncols " :key="c"
                        class="text-center border border-gray-400 border-b-0 text-black h-8" :class="{
            'bg-blue-700': c === daysOfWeek.length - 1 || c === daysOfWeek.length - 2,
            'text-gray-300': c === daysOfWeek.length - 1 || c === daysOfWeek.length - 2
        }">
                        {{ daysOfWeek[c] }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in props.rows" :key="i">
                    <td v-for="(c) in ncols" :key="c"
                        class="text-center border border-gray-400 border-t-0 text-black cursor-pointer hover:bg-blue-200 transition duration-300 ease-in-out"
                        :class="{ 'bg-blue-200': new Date().toLocaleDateString() === tablamonth[i - 1][c] }">
                        <ceillCalendar v-if="tablamonth[i - 1][c]" :fecha="tablamonth[i - 1][c]" />
                    </td>
                </tr>
            </tbody>
        </table>
        <!--
                    <button @click="nextMonth(1)"
            class="p-1 py-2 mr-2 text-black flex items-center justify-center transition duration-300 ease-in-out  hover:bg-gray-200 hover:text-white"
            :title="`Mes siguiente: ${capitalize(new Date(date.getFullYear(), date.getMonth() + 1).toLocaleString('es-ES', { month: 'long' }))} de ${new Date(date.getFullYear(), date.getMonth() + 1).getFullYear()}`">
            <i class='bx bxs-chevron-right'></i>
        </button>
    -->
    </div>
    <taskModal :showModal="showModal" :date="new Date()" @update:showModal="toggleModalState" />
</template>


<style scoped>
@media screen and (max-width: 640px) {
    .table-auto {
        font-size: 0.8rem;
    }

    .text-4xl {
        font-size: 1.5rem;
    }

    .h-screen {
        height: 100vh;
    }
}
</style>