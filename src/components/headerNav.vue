<script setup lang="ts">

import { useRouter } from 'vue-router'
const route = useRouter() // Creamos una constante para manejar las rutas

const fullName: string = import.meta.env.VITE_FULL_NAME as string // Importamos el nombre completo de la aplicación desde el archivo .env

const backgroundClass = (ruta: string): string => route.currentRoute.value.path === ruta ? 'bg-blue-700' : ''
const iconColor = (ruta: string): string => route.currentRoute.value.path === ruta ? 'text-white' : 'text-black'
//const verifyRouteEvent = computed((): boolean => route.currentRoute.value.path !== '/eventos')


</script>
<template>
    <nav
        class="fixed inset-x-0 top-0 z-10 w-full px-4 py-1 bg-white shadow-md border-slate-500 transition duration-700 ease-out">
        <div class="flex justify-between p-2">
            <div class="hidden md:flex text-[2rem] leading-[3rem] tracking-tight font-bold text-blue-700" :title="fullName">
                {{ fullName }}
            </div>
            <div class="flex items-center space-x-4 text-lg font-semibold tracking-tight">
                <div class="flex">
                    <button :class="backgroundClass('/calendario')"
                        class="flex items-center px-4 py-2 text-white transition duration-500 ease-out hover:bg-blue-700 hover:ease-in hover:underline border-2 border-gray-500 border-r-0 rounded-l-lg hover:border-blue-700"
                        type="button" title="Mostrar calendario" @click="route.push('/calendario')">
                        <i class='bx bxs-calendar' :class="iconColor('/calendario')"></i>
                    </button>
                    <button :class="backgroundClass('/eventos')"
                        class="flex items-center px-4 py-2 text-white transition duration-500 ease-out hover:bg-blue-700 hover:ease-in hover:underline border-2 rounded-r-lg border-gray-500 hover:border-blue-700"
                        type="button" title="Mostrar eventos" @click="route.push('/eventos')">
                        <i class='bx bxs-calendar-check' :class="iconColor('/eventos')"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

