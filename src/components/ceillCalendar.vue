<script setup lang="ts">
import taskModal from '@/components/taskModal.vue';
import useModal from '@/composables/useModal';

import itemTask from '@/components/itemTask.vue';

import { transformStringToDateObject } from '@/utils/date'
import { transformArrayStringToNumber } from '@/utils/arrayString'
import { ref, watch } from 'vue'

interface Props {
    fecha: string
}
const {
    showModal: modalState,
    toggleModalState
} = useModal()

const props = defineProps<Props>()
const dateProps = ref<Date>(transformStringToDateObject(props.fecha))

watch(() => props.fecha, (value) => dateProps.value = transformStringToDateObject(value))
console.log(props)

</script>

<template>
    <div class="">
        <div class="flex flex-col justify-start items-center">
            <p>{{ transformArrayStringToNumber(props.fecha, '/')[0] }}</p>
        </div>
        <div class="
            w-1/2
            h-1
            bg-gray-500
            rounded-full
            my-2
            transition
            duration-300
            ease-in-out
            hover:bg-gray-700
            hover:shadow-md
        ">
            <button>
                <i class='bx bx-plus' @click="toggleModalState"></i>
            </button>

        </div>

        <div>
        </div>
    </div>
    <taskModal :showModal="modalState" :date="dateProps" @update:showModal="toggleModalState" />
</template>

<style></style>