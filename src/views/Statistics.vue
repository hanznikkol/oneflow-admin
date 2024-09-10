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
{ id: 1, label: 'Total Customer', value: '999' },
{ id: 2, label: 'Avg. Serving Time', value: '3 min' },
{ id: 3, label: 'Avg. Waiting Time', value: '4 min' },
{ id: 4, label: 'Total Abandonment', value: '99' }
]);
</script>