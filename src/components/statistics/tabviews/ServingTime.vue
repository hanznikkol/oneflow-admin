<template> 
    <div class="w-full h-full mb-2">
        <TableLayout :header = "headerServingTime" :items = "paginatedItems"/>
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
import { ref, computed, onMounted, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import TableLayout from '../subcomponents/TableLayout.vue';
import Pagination from '../../pagination/Pagination.vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
});


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

const paginatedItems = computed(() => {
    if (!itemList.value || itemList.value.length === 0) {
        return []; // Return an empty array if itemList is not available
    }
    const start = (props.currentPage - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return itemList.value.slice(start, end);
});

const currentPage = ref(props.currentPage);
const route = useRoute();

watch(() => props.currentPage, (newVal) => {
    currentPage.value = newVal;
});

const totalItems = computed(() => itemList.value.length);

const handlePageChange = (newPage) => {
    currentPage.value = newPage; // Update local current page
    emit('pageChanged', newPage); // Emit to parent
};

</script>