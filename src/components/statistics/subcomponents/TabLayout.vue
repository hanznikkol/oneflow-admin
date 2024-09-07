<template>
    <div class="w-full flex-1 flex flex-row justify-start items-center gap-4">
        <div class="w-auto h-auto group cursor-pointer"
            :class="{
                'p-2 bg-accent rounded-lg text-primary': isActive('/statistics/servingtime'),
            }"
        >
            <RouterLink 
                to="/statistics/servingtime" 
                class="transition-all duration-100 rounded-lg"
            >
                Serving Time
            </RouterLink>
        </div>
        <div class="w-auto h-auto group cursor-pointer"
            :class="{
                'p-2 bg-accent rounded-lg text-primary': isActive('/statistics/customerjourney'),
            }"
        >
            <RouterLink 
                to="/statistics/customerjourney" 
                class="transition-all duration-100 rounded-lg"
            >
                Customer Journey
            </RouterLink>
        </div>
        <div class="w-auto h-auto group cursor-pointer"
            :class="{
                'p-2 bg-accent rounded-lg text-primary': isActive('/statistics/counterperformance'),
            }"
        >
            <RouterLink 
                to="/statistics/counterperformance" 
                class="transition-all duration-100 rounded-lg"
            >
                Counter Performance
            </RouterLink>
        </div>
        <div class="w-auto h-auto group cursor-pointer"
            :class="{
                'p-2 bg-accent rounded-lg text-primary': isActive('/statistics/graphreport'),
            }"
        >
            <RouterLink 
                to="/statistics/graphreport" 
                class="transition-all duration-100 rounded-lg"
            >
                Graph Report
            </RouterLink>
        </div>
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