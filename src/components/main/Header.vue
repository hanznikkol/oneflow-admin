<template>
    <!-- Header -->
    <div class="w-full gap-8 flex items-center pl-2">
        <!-- Logo -->
        <div class="p-2 w-12 h-12 md:w-14 md:h-14 flex justify-center items-center">
            <div class="rounded-md md:rounded-xl w-full h-full">
                <img class="object-cover w-full h-full" src="/src/assets/logo/ONEFlowMainLogo.png" />
            </div>
        </div>
        <!-- Header Text -->
        <div class="flex-1">
            <h1 class="text-base md:text-2xl font-bold">{{ headerText }}</h1>
        </div>  
        <!-- User Profile -->
        <div class="p-2 w-12 h-12 md:w-14 md:h-14 flex justify-center items-center">
            <!-- Image Container -->
            <div class="rounded-full bg-pure-white 0 w-full h-full focus:cursor-default">
                <!-- Profile Image -->
                <img class="object-cover w-full h-full rounded-full" src="/src/assets/userplaceholder.png" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const headerText = computed(() => {
    switch(route.path){
        case '/':
            return 'Glad to have you here!'
        case '/announcement':
            return 'Annoucement'
        case '/statistics':
            return 'Statistics'
        default:
            'Hello, Have a Good Day!'
    }
})
</script>
