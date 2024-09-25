<template>
<div class="w-full h-full flex gap-2 flex-col">
    <MainChartContainer :sections = "sections"/>
</div>      
 
</template>
<script setup>
import MainChartContainer from '../components/statistics/MainChartContainer.vue';
import { ref } from 'vue';

// Dynamic Sections
const sections = ref([
    { id: 1, label: 'Ticket Volume', type: 'ticket-volume' },
    { id: 2, label: 'Avg. Serving Time', type: 'average-serving-time' },
    { id: 3, label: 'Avg. Waiting Time', type: 'average-waiting-time' },
    { id: 4, label: 'Avg. Ticket Resolution Time', type: 'average-ticket-resolution-time' },
    { id: 4, label: 'Abandonment Count', type: 'abandonment-count' }
]);
</script>