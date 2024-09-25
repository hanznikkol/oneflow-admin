<template>
    <div class="w-full flex flex-grow">   
        <TableLayout :header = "headerServingTime" :items = "itemList"/>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TableLayout from '../subcomponents/TableLayout.vue';

const headerServingTime = ref([
    'Counter',
    'Shortest Waiting Time',
    'Shortest Serving Time',
    'Shortest Resolution Time',
    'Longest Waiting Time',
    'Longest Serving Time',
    'Longest Resolution Time',
    'Average Waiting Time',
    'Average Serving Time',
    'Average Resolution Time'
])

const emit = defineEmits(['update:counters'])

// List of items corresponding to the headers
const itemList = ref([]);

const getStatistics = async() => {
    try {
        const token = localStorage.getItem('jwt')
        const response = await fetch(`/api/statistics?type=all-serving-time`, { 
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

onMounted(async ()=> {
    itemList.value = await getStatistics()
})

</script>