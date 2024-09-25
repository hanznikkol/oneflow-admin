<template>
    <div class="w-full flex flex-grow">
        <TableLayout :header = "headerCounterPerformance" :items = "itemList" />
    </div>
    
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TableLayout from '../subcomponents/TableLayout.vue';

const headerCounterPerformance = ref([
    'Counter',
    'Counter Personnel',
    'Total Served Count',
    'Average Waiting Time',
    'Average Serving Time',
    'Average Resolution Time',
])

const itemList = ref([])

const getStatistics = async() => {
    try {
        const token = localStorage.getItem('jwt')
        const response = await fetch(`/api/statistics?type=all-counter-performance`, { 
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

onMounted( async ()=> {
    itemList.value = await getStatistics()
})
</script>