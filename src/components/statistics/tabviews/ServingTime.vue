<template>
    <div class="w-full flex flex-grow">   
        <TableLayout :headers = "headerServingTime" :items = "itemList"/>
    </div>
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

// List of items corresponding to the headers
const itemList = ref([
    {
        'Counter': 'Cashier',
        'Shortest Waiting Time': '2 mins',
        'Shortest Serving Time': '3 mins',
        'Shortest Total Time': '5 mins',
        'Longest Waiting Time': '10 mins',
        'Longest Serving Time': '8 mins',
        'Longest Total Time': '18 mins',
        'Average Waiting Time': '5 mins',
        'Average Serving Time': '5.5 mins',
        'Average Total Time': '10.5 mins'
    },
    {
        'Counter': 'Registrar',
        'Shortest Waiting Time': '1 min',
        'Shortest Serving Time': '2 mins',
        'Shortest Total Time': '3 mins',
        'Longest Waiting Time': '12 mins',
        'Longest Serving Time': '9 mins',
        'Longest Total Time': '21 mins',
        'Average Waiting Time': '6 mins',
        'Average Serving Time': '5 mins',
        'Average Total Time': '11 mins'
    },

]);

</script>