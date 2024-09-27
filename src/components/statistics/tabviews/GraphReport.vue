<template>
    <!-- Graph -->
    <div class="bg-[#ffffff] relative w-full h-full lg:flex-[2] min-h-svh md:min-h-0 flex flex-col">
        <LineGraph :chartStatistics="chartStatistics"></LineGraph>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import LineGraph from '../subcomponents/LineGraph.vue';

const chartStatistics = ref({})

const props = defineProps({
    counter: {
        type: String
    },
    type: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    }
})



const getStatistics = async (counter, type, startDate, endDate) => {
    try {
        const token = localStorage.getItem('jwt')
        const response = await fetch(`/api/statistics?at=${counter}&type=${type}&start=${startDate}&end=${endDate}`, { 
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

onMounted(()=>{
    console.log(props.type)
})


watch([()=> props.counter, () => props.type, () => props.startDate, () => props.endDate], async ([newCounter, newType, newStartDate, newEndDate]) => {
    if(!newType) return
    chartStatistics.value = await getStatistics(newCounter, newType, newStartDate, newEndDate)
}, {immediate: true})

</script>