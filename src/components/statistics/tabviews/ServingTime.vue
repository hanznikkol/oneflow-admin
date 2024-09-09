<template>
    <TableLayout/>
</template>

<script setup>
import { ref } from 'vue';
import TableLayout from '../subcomponents/TableLayout.vue';

const headerServingTime = ref([
    'Counter',
    'Shortest Waiting Time',
    'Shortest Serving Time',
    'Shortest Total Time',
    'Longest Waiting Time',
    'Longest Serving Time',
    'Longest Total Time',
    'Average Waiting Time',
    'Average Serving Time',
    'Average Total Time'
])
</script>