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

const { showModal, toggleModalState } = useModal()
const { deleteEvent: handleRemoveEvent } = useEventAction()
const { loading } = storeToRefs(useEventsStore())
const props = withDefaults(defineProps<CalendarProps>(), {
    daysOfWeek: () => import.meta.env.VITE_DAYS_OF_WEEK_DEFAULT.split(',') as Array<string>,
    cols: Number(import.meta.env.VITE_CALENDAR_COLS_DEFAULT) as number,
    rows: Number(import.meta.env.VITE_CALENDAR_ROWS_DEFAULT) as number,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
})
const tablamonth = ref<string[][]>([])

//const date = ref<Date>(new Date(props.year, props.month - 1))

const {
    date,
    nextMonth,
    setDate,
} = useDate(new Date(props.year, props.month - 1))

const ncols = ref<number[]>(createArray(props.cols as number))
//const monthCurrent = ref<number>(date.value.getMonth() + 1)
//const yearCurrent = ref<number>(date.value.getFullYear())

const anadevalorSecuencial = (numero: number, valor: string, celdas: string[][]) => {
    const fila = Math.floor(numero / props.daysOfWeek.length);
    const columna = numero % props.daysOfWeek.length;
    celdas[fila][columna] = valor;
}

const calcularTablamonth = () => {
    const celdas: string[][] = Array.from(Array(props.daysOfWeek.length).keys()).map(() => Array.from(Array(props.rows).keys()).map(() => ''))
    const primerDia: Date = new Date(`${date.value.getFullYear()}-${date.value.getMonth() + 1}-01`)
    let posicionPrimerDia = transformArrayStringToNumber(import.meta.env.VITE_INDEX_FOR_DAY_DEFAULT as string)[primerDia.getDay()]
    //if(languageCurrent.value === 'en') posicionPrimerDia = (posicionPrimerDia + 1) % 7
    const numDiasmonth: number = new Date(date.value.getFullYear(), date.value.getMonth() + 1, 0).getDate()
    const rangoNumeros: Array<number> = createArray(numDiasmonth).map(i => i + posicionPrimerDia || 0)
    rangoNumeros.map((el, index): void => anadevalorSecuencial(el, new Date(date.value.getFullYear(), date.value.getMonth(), (index + 1)).toLocaleDateString(), celdas))
    tablamonth.value = celdas
}

watchEffect(
    () => {
        setDate(new Date(props.year, props.month - 1))
        ncols.value = props.cols as number[]
        calcularTablamonth()
        //monthCurrent.value = date.value.getMonth() + 1
        //yearCurrent.value = date.value.getFullYear()
    }
)

//********************************************************** */
//const selectedOption = ref<number>(0)

/*
const selectOptions: Array<objectOptions> = [
    { text: 'Todos los dias', start: props.daysOfWeek.length - 7, end: props.daysOfWeek.length },
    { text: 'Lunes a viernes', start: 0, end: props.daysOfWeek.length - 2 },
    { text: 'Fines de semana', start: props.daysOfWeek.length - 2, end: props.daysOfWeek.length },
    { text: '3 primeros dias', start: 0, end: props.daysOfWeek.length - 4 },
    { text: '3 ultimos dias', start: props.daysOfWeek.length - 3, end: props.daysOfWeek.length }
]

const handleSelect = () => {
    const { start, end } = selectOptions[selectedOption.value]
    ncols.value = createArray(props.daysOfWeek.length).slice(start, end)
}
*/
const changingMonth = ref<boolean>(false);

const nextMonthWithDelay = (n: number): void => {
    if (!changingMonth.value) {
        changingMonth.value = true;
        setTimeout(() => {
            nextMonth(n);
            changingMonth.value = false;
        }, 1000);
    }
}
//******************************************************************** */
//const nextMonth = (n: number): Date => date.value = new Date(date.value.getFullYear(), date.value.getMonth() + n, 1)
//const nextYear = (n: number): Date => date.value = new Date(date.value.getFullYear() + n, date.value.getMonth(), 1)

const focusDayToday = (day: string): string => day === new Date().toLocaleDateString() ? 'bg-blue-200' : ''
</script>

<template>
    <!--
    <div class="flex flex-row items-center justify-start gap-2 w-full mx-2">
        <select name="months" id="months" v-model="monthCurrent" @change="nextMonth(monthCurrent - date.getMonth() - 1)"
            class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg">
            <option v-for="month in 12" :key="month" :value="month" :selected="month === date.getMonth() + 1"
                :title="`Seleccionar el mes de ${new Date(date.getFullYear(), month - 1).toLocaleString('es-ES', { month: 'long' })}`">
                {{ capitalize(new Date(date.getFullYear(), month - 1).toLocaleString('es-ES', { month: 'long' })) }}
            </option>
        </select>

        <input type="number" min="1900" max="2100"
            class="w-20 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
            v-model="yearCurrent" @input="nextYear(yearCurrent - date.getFullYear())">

        <select name="daysOfWeek" id="daysOfWeek"
            class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg">
            <option value="es">Español</option>
            <option value="en">Ingles</option>
        </select>
    </div>
    -->

    <div class="flex justify-between items-center px-4 mb-2"
        :class="{ 'opacity-20': loading, 'pointer-events-none': loading }">
        <div class="flex items-center"> <!-- Este div contiene los botones de navegación -->
            <button @click="$emit('update:today' , new Date())"
                class="p-1 py-2 text-black rounded-lg flex items-center justify-center shadow-md transition duration-300 ease-in-out border border-gray-500 hover:bg-blue-700 hover:text-white"
                :title="`Hoy es ${transformDateToDateInfo(new Date())}`">
                <i class='bx bxs-calendar'></i>
                Hoy
            </button>
            <button @click="$emit('update:month', -1)"
                class="p-1 py-2 ml-4  text-black  flex items-center justify-center transition duration-300 ease-in-out bg-none hover:bg-gray-200 hover:text-white">
                <i class='bx bxs-chevron-left'
                    :title="`Mes anterior: ${capitalize(new Date(date.getFullYear(), date.getMonth() - 1).toLocaleString('es-ES', { month: 'long' }))} de ${new Date(date.getFullYear(), date.getMonth() - 1).getFullYear()}`"></i>
            </button>
            <button @click="$emit('update:month', 1)"
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
                <!--
                <select class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out mr-2
                    cursor-pointer rounded-lg" v-model="selectedOption" @change="handleSelect"
                    title="Seleccionar dias a mostrar">
                    <option disabled>Mostrar por dias especificos...</option>
                    <option v-for="(option, index) in selectOptions" :key="index" :value="index"> {{ option.text }}
                    </option>
                </select>
                -->
                <button
                    class="bg-blue-500 px-2 mr-1 rounded-full text-black shadow-md hover:bg-blue-700 transition duration-300 ease-in-out hover:text-white"
                    title="Agregar tarea" @click="toggleModalState">
                    <i class='bx bxs-calendar-plus bx-sm'></i>
                </button>
                <button
                    class="bg-red-300 px-2  mr-1 rounded-full py-1 text-black shadow-md hover:bg-red-600 transition duration-300 ease-in-out hover:text-white transform hover:-translate-y-1"
                    title="Papelera de reciclaje"
                    @dragover.prevent
                    @drop.prevent="handleRemoveEvent(Number($event.dataTransfer?.getData('text/plain')))">
                    <i class='bx bxs-trash bx-flip-horizontal bx-sm'></i>
                </button>
            </div>
        </div>
    </div>
    <slot name="loading"></slot>
    <div class="h-screen w-full flex flex-row" :class="{ 'opacity-20': loading, 'pointer-events-none': loading }">
        <!-- boton con felcha-->
        <button @click="nextMonth(-1)"
            class="p-1 py-2 ml-2 h-auto text-black  flex items-center justify-center transition duration-300 ease-in-out bg-none hover:bg-gray-200 hover:text-white">
            <i class='bx bxs-chevron-left'
                :title="`Mes anterior: ${capitalize(new Date(date.getFullYear(), date.getMonth() - 1).toLocaleString('es-ES', { month: 'long' }))} de ${new Date(date.getFullYear(), date.getMonth() - 1).getFullYear()}`"></i>
        </button>
        <table class="table-auto border-collapse border w-full h-screen">
            <thead>
                <tr>
                    <th v-for="c in ncols " :key="c" class="text-center border border-gray-400 border-b-0 text-black h-8">
                        {{ daysOfWeek[c] }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in props.rows" :key="i">
                    <td v-for="(c) in ncols" :key="c"
                        class="text-center border border-gray-400 border-t-0 text-black cursor-pointer hover:bg-blue-200 transition duration-300 ease-in-out"
                        :class="focusDayToday(tablamonth[i - 1][c])">
                        <ceillCalendar v-if="tablamonth[i - 1][c]" :fecha="tablamonth[i - 1][c]" />
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="nextMonth(1)"
            class="p-1 py-2 mr-2 text-black flex items-center justify-center transition duration-300 ease-in-out  hover:bg-gray-200 hover:text-white"
            :title="`Mes siguiente: ${capitalize(new Date(date.getFullYear(), date.getMonth() + 1).toLocaleString('es-ES', { month: 'long' }))} de ${new Date(date.getFullYear(), date.getMonth() + 1).getFullYear()}`">
            <i class='bx bxs-chevron-right'></i>
        </button>
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