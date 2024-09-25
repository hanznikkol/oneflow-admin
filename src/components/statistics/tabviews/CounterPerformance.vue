<template>
    <div class="w-full h-full mb-2">
        <TableLayout :header = "headerCounterPerformance" :items = "paginatedItems" />
    </div>
    
    <div class="bg-pure-white w-full h-auto p-2 rounded-lg flex items-center">
        <Pagination
            :currentPage="currentPage"
            :totalItems="totalItems"
            :itemsPerPage="itemsPerPage"
            @update:currentPage="handlePageChange"
        />
    </div>
    
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import TableLayout from '../subcomponents/TableLayout.vue';
import Pagination from '../../pagination/Pagination.vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: false,
  },
  itemsPerPage: {
    type: Number,
    required: false,
  },
});


const headerCounterPerformance = ref([
    'Counter',
    'Counter Personnel',
    'Total Served Count',
    'Average Waiting Time',
    'Average Serving Time',
    'Average Resolution Time',
])

const itemList = ref([])
const emit = defineEmits()

const paginatedItems = computed(() => {
    const start = (props.currentPage - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return itemList.value.slice(start, end);
});

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

const currentPage = ref(props.currentPage);
const totalItems = computed(() => itemList.value.length);
const route = useRoute();

const handlePageChange = (newPage) => {
    currentPage.value = newPage; // Update local current page
    emit('pageChanged', newPage); // Emit to parent
};


watch(() => props.currentPage, (newVal) => {
    currentPage.value = newVal;
});

</script>