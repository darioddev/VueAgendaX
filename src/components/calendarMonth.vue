<script setup lang="ts">
import ceillCalendar from '@/components/ceillCalendar.vue'
import useEventsStore from '@/stores/events'
import useModal from '@/composables/useModal'
import taskModal from '@/components/taskModal.vue'
import useDate from '@/composables/useDate'

import type { CalendarProps } from '@/interfaces/calendarProps'
import { createArray, transformArrayStringToNumber } from '@/utils/arrayString'
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

const props = withDefaults(defineProps<CalendarProps>(), {
    daysOfWeek: () => import.meta.env.VITE_DAYS_OF_WEEK_ES.split(',') as Array<string>,
    cols: Number(import.meta.env.VITE_CALENDAR_COLS_DEFAULT) as number,
    rows: Number(import.meta.env.VITE_CALENDAR_ROWS_DEFAULT) as number,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
})

const { date, setDate } = useDate(new Date(props.year, props.month - 1))
const { showModal, toggleModalState } = useModal()
const { loading } = storeToRefs(useEventsStore())


const tablamonth = ref<string[][]>([])

const anadevalorSecuencial = (numero: number, valor: string, celdas: string[][]) => {
    const fila = Math.floor(numero / props.daysOfWeek.length);
    const columna = numero % props.daysOfWeek.length;
    celdas[fila][columna] = valor;
}

const calcularTablamonth = () => {
    const celdas: string[][] = Array.from(Array(props.daysOfWeek.length).keys()).map(() => Array.from(Array(props.rows).keys()).map(() => ''))
    const primerDia: Date = new Date(`${date.value.getFullYear()}-${date.value.getMonth() + 1}-01`)
    const posicion: Array<number> = props?.lang === 'en-US' ? transformArrayStringToNumber(import.meta.env.VITE_INDEX_FOR_DAY_EN as string) : transformArrayStringToNumber(import.meta.env.VITE_INDEX_FOR_DAY_ES as string)
    const posicionPrimerDia = posicion[primerDia.getDay()]
    const numDiasmonth: number = new Date(date.value.getFullYear(), date.value.getMonth() + 1, 0).getDate()
    const rangoNumeros: Array<number> = createArray(numDiasmonth).map(i => i + posicionPrimerDia || 0)
    rangoNumeros.map((el, index): void => anadevalorSecuencial(el, new Date(date.value.getFullYear(), date.value.getMonth(), (index + 1)).toLocaleDateString(), celdas))
    tablamonth.value = celdas
}

const ncols = ref<number[]>(createArray(props.cols as number))
const emit = defineEmits(['update:year', 'update:month'])

let timeout: ReturnType<typeof setTimeout> | null = null;
const nextMonthWithDelay = (event: DragEvent) => {
        const x = event.clientX

    if ((x < 50 || x > window.innerWidth - 50) &&
        event.dataTransfer?.types.includes('text/plain')) {
        if (!timeout) {
            timeout = setTimeout(() => {
                emit('update:month', x < 50 ? -1 : 1)
                timeout = null
            }, 500)
        }
    } else {
        clearTimeout(timeout as ReturnType<typeof setTimeout>)
        timeout = null
    }
}

watchEffect(
    () => {
        setDate(new Date(props.year, props.month - 1))
        ncols.value = props.cols as number[]
        calcularTablamonth()
    }
)

const backgroundWeek = (c: number): { [key: string]: boolean } => {
    const positionSaturday = props?.lang === 'en-US' ? 0 : props?.daysOfWeek.length - 1
    const positionSunday = props?.lang === 'en-US' ? props?.daysOfWeek.length - 1 : props?.daysOfWeek.length - 2
    return {
        'bg-blue-700': c === positionSaturday || c === positionSunday,
        'text-gray-300': c === positionSaturday || c === positionSunday
    }
}

</script>

<template>
    <div class="flex flex-row justify-between items-center ml-4">
    <slot name="month"></slot>
    </div>

    <div class="h-full w-full flex flex-row" :class="{ 'opacity-20': loading, 'pointer-events-none': loading }"
        @dragover.prevent="nextMonthWithDelay">
        <table class="border-collapse border w-full h-full mx-4" :class="props?.class">
            <thead>
                <tr>
                    <th v-for="c in ncols " :key="c" :class="backgroundWeek(c)"
                        class="text-center border border-gray-400 border-b-0 text-black h-8">
                        {{ props.daysOfWeek[c] }}
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