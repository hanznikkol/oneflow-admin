<template>
  <div class=" w-full min-h-screen md:min-h-full flex gap-2 flex-col">
      <!-- Text Statistics -->
      <FilterContainer/>
      <!-- Graphs -->
      <MainChartContainer :sections = "sections"/>
  </div>      
 
</template>
<script setup>
import FilterContainer from '../components/statistics/FilterContainer.vue';
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