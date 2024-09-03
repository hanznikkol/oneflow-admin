<template>
    <div class="min-h-svh md:min-h-screen w-full flex flex-col px-4 py-2 md:py-1">
        <!-- Header -->
        <Header></Header>

        <!-- SideNav and Main Container -->
        <div class="gap-4 w-full flex-1 flex flex-col lg:flex-row">
            <div>
                <SideBarNavigation></SideBarNavigation>
            </div>

            <div class="w-full flex-1">
                <!-- Uncomment to Change View in Main Container -->
                <!-- <Dashboard></Dashboard> -->
                <!-- <QueueControl></QueueControl> -->
                <!-- <Statistics></Statistics> -->
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '../components/main/Header.vue';
import SideBarNavigation from '../components/main/SideBarNavigation.vue';

import { RouterView } from 'vue-router'
</script>
    
