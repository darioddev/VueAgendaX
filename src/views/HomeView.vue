<script setup lang="ts">
const fullName: string = import.meta.env.VITE_FULL_NAME as string
</script>
<template>
    <div class="bg-gray-200 min-h-screen flex items-center justify-center" id="main">
        <div class="flex flex-col items-center justify-center text-center text-black">
            <h1 class="text-6xl font-bold mb-4 text-blue-700">
                {{ fullName }}
            </h1>
            <!-- Contenedor con un button -->
            <div class="flex flex-col items-center justify-center">
                <div class="flex flex-col items-center justify-center">
                    <RouterLink to="/calendario"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-4">Ir a
                        calendario</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    animation: fadeIn 2s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>