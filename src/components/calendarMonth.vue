<script setup lang="ts">
import ceillCalendar from '@/components/ceillCalendar.vue'
import useEvents from '@/composables/useEvents'
import useModal from '@/composables/useModal'
import taskModal from '@/components/taskModal.vue'
import type { CalendarProps } from '@/interfaces/calendarProps'
import { transformDateToDateInfo, transformStringToDate } from '@/utils/date'
import { createArray, transformArrayStringToNumber, capitalize } from '@/utils/arrayString'
import { removeEvent } from '@/utils/request'
import useMutationEvent from '@/composables/useMutate'

import { useRouter } from 'vue-router';
import { ref, watchEffect } from 'vue'

const { mutateAsync } = useMutationEvent()
const { isLoading, isError } = useEvents()
const { showModal, toggleModalState } = useModal()

const props = withDefaults(defineProps<CalendarProps>(), {
    daysOfWeek: () => import.meta.env.VITE_DAYS_OF_WEEK_DEFAULT.split(',') as Array<string>,
    cols: Number(import.meta.env.VITE_CALENDAR_COLS_DEFAULT) as number,
    rows: Number(import.meta.env.VITE_CALENDAR_ROWS_DEFAULT) as number,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
})
const date = ref<Date>(new Date(props.year, props.month - 1))
const tablamonth = ref<string[][]>([])

const anadevalorSecuencial = (numero: number, valor: string, celdas: string[][]) => {
    const fila = Math.floor(numero / props.cols);
    const columna = numero % props.cols;
    celdas[fila][columna] = valor;
}

const calcularTablamonth = () => {
    const celdas: string[][] = Array.from(Array(props.cols).keys()).map(() => Array.from(Array(props.rows).keys()).map(() => ''))
    const primerDia: Date = new Date(`${date.value.getFullYear()}-${date.value.getMonth() + 1}-01`)
    const posicionPrimerDia = transformArrayStringToNumber(import.meta.env.VITE_INDEX_FOR_DAY_DEFAULT as string)[primerDia.getDay()]
    const numDiasmonth: number = new Date(date.value.getFullYear(), date.value.getMonth() + 1, 0).getDate()
    const rangoNumeros: Array<number> = createArray(numDiasmonth).map(i => i + posicionPrimerDia)
    rangoNumeros.map((el, index): void => anadevalorSecuencial(el, new Date(date.value.getFullYear(), date.value.getMonth(), (index + 1)).toLocaleDateString(), celdas))
    tablamonth.value = celdas
}


watchEffect(
    () => {
        calcularTablamonth()
    }
)

const nextMonth = (n: number): Date => date.value = new Date(date.value.getFullYear(), date.value.getMonth() + n, 1)
const dayToday = (): Date => date.value = new Date()
const focusDayToday = (day: string): string => day === new Date().toLocaleDateString() ? 'bg-blue-200' : ''

const handleRemoveEvent = async (event: DragEvent) => {
    const id: number = Number(event.dataTransfer?.getData('text/plain'))
    if (confirm('¿Desea eliminar la tarea?')) {
        mutateAsync(() => removeEvent(id))
    }
}

</script>

<template>
    <!--Ventana de cargando eventos -->
    <div v-if="isLoading" class="h-screen w-full flex items-center justify-center">
        <div class="flex flex-col items-center justify-center">
            <i class='bx bx-loader-alt bx-spin text-6xl text-blue-700'></i>
            <p class="text-2xl text-blue-700">Cargando eventos...</p>
        </div>
    </div>
    <div class="pt-20" v-if="!isLoading">
        <div v-if="isError" class="bg-red-200 border-l-4 border-red-500 text-red-700 p-1 m-2 relative" role="alert">
            <p class="font-bold">Error</p>
            <div class="flex flex-row items-center justify-between">
                <p class="w-4/5">Ha habido un error al obtener los eventos, puede que no se muestren todos sus eventos</p>
                <i class='bx bx-x-circle cursor-pointer absolute top-0 right-0 mr-2 mt-2 bx-sm'
                    title="Cerrar mensaje de error"></i>
            </div>
            <!-- Icono con una x en la parte derecha para cerrar este mensaje en caso de que el usuario quiera cerrarlo -->
        </div>
        <div class="flex justify-between items-center px-4 mb-2">
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
                <h3 class="text-4xl font-bold pb-1 text-blue-700 cursor-pointer">{{ capitalize(date.toLocaleString('es-ES', {
                    month:
                        'long'
                })) }}
                    de {{ date.getFullYear() }}</h3>
            </div>
            <div class="flex items-center">
                <div class="flex flex-row ml-auto">
                    <button
                        class="bg-blue-500 px-2 mr-1 rounded-full text-black shadow-md hover:bg-blue-700 transition duration-300 ease-in-out hover:text-white"
                        title="Agregar tarea"
                        @click="toggleModalState"
                        >
                        <i class='bx bxs-calendar-plus bx-sm'></i>
                    </button>
                    <button
                        class="bg-red-300 px-2  mr-1 rounded-full py-1 text-black shadow-md hover:bg-red-600 transition duration-300 ease-in-out hover:text-white transform hover:-translate-y-1"
                        title="Papelera de reciclaje" 
                        @dragover="$event.preventDefault()"
                        @drop="handleRemoveEvent"
                        >
                        <i class='bx bxs-trash bx-flip-horizontal bx-sm'></i>
                    </button>

                </div>
            </div>
        </div>

        <div class="h-screen w-full">
            <table class="table-auto border-collapse border w-full h-screen">
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="c in daysOfWeek" :key="c"
                            class="text-center border border-gray-400 border-b-0 text-black h-8">
                            {{ c }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in props.rows" :key="i">
                        <th></th>
                        <td v-for="(c, j) in daysOfWeek" :key="c"
                            class="text-center border border-gray-400 border-t-0 text-black cursor-pointer hover:bg-blue-200 transition duration-300 ease-in-out"
                            :title="`Ver eventos del dia ${transformStringToDate(tablamonth[i - 1][j] || '')}`"
                            :class="focusDayToday(tablamonth[i - 1][j])">
                            <ceillCalendar v-if="tablamonth[i - 1][j]" :fecha="tablamonth[i - 1][j]" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <taskModal :showModal="showModal" @update:showModal="toggleModalState" />

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