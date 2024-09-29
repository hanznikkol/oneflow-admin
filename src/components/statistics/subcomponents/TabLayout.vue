<template>
    <div class="w-full flex-1 flex flex-row justify-center lg:justify-start items-center gap-4 ">
        
        <!-- Serving Time -->
        <RouterLink 
            to="/admin/statistics/servingtime" 
            class="w-auto h-auto group cursor-pointer p-2 transition-all duration-100 rounded-lg text-xs lg:text-sm lg:whitespace-nowrap"
            :class="{
                'bg-accent rounded-lg text-primary': isActive('/admin/statistics/servingtime'),
            }"
        >
            Serving Time
        </RouterLink>

        <!-- Customer Journey -->
        <RouterLink 
            to="/admin/statistics/customerjourney" 
            class="w-auto h-auto group cursor-pointer p-2 transition-all duration-100 rounded-lg text-xs lg:text-sm lg:whitespace-nowrap"
            :class="{
                'bg-accent rounded-lg text-primary': isActive('/admin/statistics/customerjourney'),
            }"
        >
            Customer Journey
        </RouterLink>

        <!-- Counter Performance -->
        <RouterLink 
            to="/admin/statistics/counterperformance" 
            class="w-auto h-auto group cursor-pointer p-2 transition-all duration-100 rounded-lg text-xs lg:text-sm lg:whitespace-nowrap"
            :class="{
                'bg-accent rounded-lg text-primary': isActive('/admin/statistics/counterperformance'),
            }"
        >
            Counter Performance
        </RouterLink>
        
        <!-- Graph Report -->
        <RouterLink 
            to="/admin/statistics/graphreport" 
            class="w-auto h-auto group cursor-pointer p-2 transition-all duration-100 rounded-lg text-xs lg:text-sm lg:whitespace-nowrap"
            :class="{
                'bg-accent rounded-lg text-primary': isActive('/admin/statistics/graphreport'),
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

const props = defineProps({
    selectedDate: {
        type: Array
    }
})

const isActive = (path) => {
    return route.path === path || route.path.startsWith(path + '/');
}

</script>