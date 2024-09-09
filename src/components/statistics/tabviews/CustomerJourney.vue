<template>
    <TableLayout 
        :headers = "headerCustomerJourney" 
        :items="itemList" 
        status-column="Status"
        :status-classes="statusClasses"
        />
</template>

<script setup>
import { ref } from 'vue';
import TableLayout from '../subcomponents/TableLayout.vue';

const headerCustomerJourney = ref([
    'Counter',
    'Processed By',
    'Queue No.',
    'Created Date',
    'Start Serving',
    'Waiting Time',
    'Served Time',
    'Serving Time Time',
    'Total Time',
    'Status'
])

const itemList = ref([
    {
        'Counter': 'Cashier',
        'Processed By': 'Personel A',
        'Queue No.': 1,
        'Created Date': '2024-09-01',
        'Start Serving': '2024-09-01 10:00',
        'Waiting Time': '5 mins',
        'Served Time': '10 mins',
        'Serving Time Time': '15 mins',
        'Total Time': '20 mins',
        Status: 'Completed'
    },
    {
        'Counter': 'Registrar',
        'Processed By': 'Personel B',
        'Queue No.': 2,
        'Created Date': '2024-09-02',
        'Start Serving': '2024-09-02 11:00',
        'Waiting Time': '10 mins',
        'Served Time': '15 mins',
        'Serving Time Time': '20 mins',
        'Total Time': '30 mins',
        Status: 'Pending'
    },
    // Add more items as needed
]);

const statusClasses = ref({
    Completed: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-start justify-center',
    Pending: 'bg-red-400 text-black p-1 rounded w-16 h-auto flex items-start justify-center',
});
</script>