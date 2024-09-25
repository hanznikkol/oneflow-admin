<template>
    <div class="w-full flex flex-grow">
        <TableLayout 
        :header = "headerCustomerJourney" 
        :items="itemList" 
        :status-classes="statusClasses"
        />
    </div>
    
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TableLayout from '../subcomponents/TableLayout.vue';

const headerCustomerJourney = ref([
    'Counter',
    'Processed By',
    'Queue No.',
    'Created Time',
    'Called Time',
    'Waiting Time',
    'Serving Time',
    'Served Time',
    'Resolution Time',
    'Status'
])

const itemList = ref([]);

const statusClasses = ref({
    Completed: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center',
    Pending: 'bg-red-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center',
});

const getStatistics = async() => {
    try {
        const token = localStorage.getItem('jwt')
        const response = await fetch(`/api/statistics?type=all-customer-journey`, { 
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        if(!response.ok) return alert(`An error occured: ${data.error}`)

        return data.statistics
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

onMounted(async()=> {
    itemList.value = await getStatistics()
})
</script>