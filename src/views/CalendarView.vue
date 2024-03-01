<script setup lang="ts">
import calendarMonth from '@/components/calendarMonth.vue';
import headerNav from '@/components/headerNav.vue';
import useDate from '@/composables/useDate';

import { ref } from 'vue';
import { createArray, capitalize } from '@/utils/arrayString';

interface objectOptions {
    text: string;
    start: number;
    end: number;
}

const { date, nextMonth, nextYear, monthCurrent, yearCurrent, dayToday } = useDate(new Date())
const daysOfWeek = ref<Array<string>>(import.meta.env.VITE_DAYS_OF_WEEK_DEFAULT.split(','))
const ncols = ref<number[]>(createArray(daysOfWeek.value.length))
const selectedOption = ref<number>(0)
const selectedLanguageIndex = ref<number>(0)


const selectOptions: objectOptions[][] = [
    [{ text: 'Todos los dias', start: daysOfWeek.value.length - 7, end: daysOfWeek.value.length },
    { text: 'Lunes a viernes', start: 0, end: daysOfWeek.value.length - 2 },
    { text: 'Fines de semana', start: daysOfWeek.value.length - 2, end: daysOfWeek.value.length },
    { text: '3 primeros dias', start: 0, end: daysOfWeek.value.length - 4 },
    { text: '3 ultimos dias', start: daysOfWeek.value.length - 3, end: daysOfWeek.value.length }]
    ,
    [{ text: 'All days', start: daysOfWeek.value.length - 7, end: daysOfWeek.value.length },
    { text: 'Monday to Friday', start: 0, end: daysOfWeek.value.length - 2 },
    { text: 'Weekends', start: daysOfWeek.value.length - 2, end: daysOfWeek.value.length },
    { text: 'First 3 days', start: 0, end: daysOfWeek.value.length - 4 },
    { text: 'Last 3 days', start: daysOfWeek.value.length - 3, end: daysOfWeek.value.length }
    ]
]

const selectOptionsLanguage = [
    { text: 'Español', value: 'es' },
    { text: 'Ingles', value: 'en' }
]

const handleSelect = (): void => {
    const { start, end } = selectOptions[selectedLanguageIndex.value][selectedOption.value]
    ncols.value = createArray(daysOfWeek.value.length).slice(start, end)
}

</script>

<template>
    <div class="pt-20">
        <headerNav />
        <div class="flex flex-row items-center justify-start gap-2 w-full mx-2">
            <!-- Select con todos los dias -->
            <select name="daysOfWeek" id="daysOfWeek"
                class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
                v-model="selectedOption" @change="handleSelect">
                <option v-for="(option, index) in selectOptions[selectedLanguageIndex]" :key="index" :value="index"
                    class="text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
                    :title="option.text">
                    {{ option.text }}
                </option>
            </select>


            <select name="months" id="months" v-model="monthCurrent" @change="nextMonth(monthCurrent - date.getMonth() - 1)"
                class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg">
                <option v-for="month in 12" :key="month" :value="month" :selected="month === date.getMonth() + 1"
                    class="text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
                    :title="`Seleccionar el mes de ${new Date(date.getFullYear(), month - 1).toLocaleString('es-ES', { month: 'long' })}`">
                    {{ capitalize(new Date(date.getFullYear(), month - 1).toLocaleString('es-ES', { month: 'long' })) }}
                </option>
            </select>
            <input type="number" min="1900" max="2100"
                class="w-20 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
                v-model="yearCurrent" @input="nextYear(yearCurrent - date.getFullYear())">

            <!-- Tipo de calendario ingles o español -->
            <select name="daysOfWeek" id="daysOfWeek"
                class="w-36 px-2 py-1 text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
                v-model="selectedLanguageIndex">
                <option v-for="(option, index) in selectOptionsLanguage" :key="index" :value="index"
                    class="text-gray-600 font-medium  bg-gray-100 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer rounded-lg"
                    :title="option.text">
                    {{ option.text }}
                </option>
            </select>
        </div>
        <slot name="error"></slot>
        <calendarMonth :cols="ncols" :month="monthCurrent" :year="yearCurrent" @update:month="nextMonth" @update:today="dayToday">
            <template v-slot:loading>
                <slot name="loading"></slot>
            </template>
        </calendarMonth>
    </div>
</template>


<style scoped></style>