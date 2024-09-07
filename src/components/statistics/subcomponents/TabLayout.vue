<template>
    <div class="w-full flex-1 flex flex-row justify-center lg:justify-start items-center gap-4 ">
        
        <!-- Serving Time -->
        <RouterLink 
            to="/statistics/servingtime" 
            class="w-auto h-auto group cursor-pointer p-2 transition-all duration-100 rounded-lg text-xs lg:text-sm lg:whitespace-nowrap"
            :class="{
                'bg-accent rounded-lg text-primary': isActive('/statistics/servingtime'),
            }"
        >
            Serving Time
        </RouterLink>

        <!-- Customer Journey -->
        <RouterLink 
            to="/statistics/customerjourney" 
            class="w-auto h-auto group cursor-pointer p-2 transition-all duration-100 rounded-lg text-xs lg:text-sm lg:whitespace-nowrap"
            :class="{
                'bg-accent rounded-lg text-primary': isActive('/statistics/customerjourney'),
            }"
        >
            Customer Journey
        </RouterLink>

        <!-- Counter Performance -->
        <RouterLink 
            to="/statistics/counterperformance" 
            class="w-auto h-auto group cursor-pointer p-2 transition-all duration-100 rounded-lg text-xs lg:text-sm lg:whitespace-nowrap"
            :class="{
                'bg-accent rounded-lg text-primary': isActive('/statistics/counterperformance'),
            }"
        >
            Counter Performance
        </RouterLink>
        
        <!-- Graph Report -->
        <RouterLink 
            to="/statistics/graphreport" 
            class="w-auto h-auto group cursor-pointer p-2 transition-all duration-100 rounded-lg text-xs lg:text-sm lg:whitespace-nowrap"
            :class="{
                'bg-accent rounded-lg text-primary': isActive('/statistics/graphreport'),
            }"
        >
            Graph Report
        </RouterLink>
    </div>
</template>

<script setup>
import { watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isActive = (path) => {
    return route.path === path || route.path.startsWith(path + '/');
}

const redirectToDefaultTab = () => {
    if (route.path === '/statistics') {
        router.replace('/statistics/servingtime');
    }
};

watch(() => route.path, redirectToDefaultTab, { immediate: true });
</script>