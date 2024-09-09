<template>
    <TableLayout :headers = "headerCounterPerformance" :items = "itemList" />
</template>

<script setup>
import { ref } from 'vue';
import TableLayout from '../subcomponents/TableLayout.vue';

const headerCounterPerformance = ref([
    'Counter',
    'Counter Personel',
    'Total Served Count',
    'Average Waiting Time',
    'Average Serving Time',
    'Average Total Time',
])

const itemList = ref([
    {
        'Counter': 'Cashier',
        'Counter Personel': 'Personel A',
        'Total Served Count': 150,
        'Average Waiting Time': '5 mins',
        'Average Serving Time': '10 mins',
        'Average Total Time': '15 mins',
    },
    {
        Counter: 'Registrar',
        'Counter Personel': 'Personel B',
        'Total Served Count': 120,
        'Average Waiting Time': '4 mins',
        'Average Serving Time': '9 mins',
        'Average Total Time': '13 mins',
    },
])
</script>