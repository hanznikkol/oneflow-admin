<template>
    <div class="relative w-full flex flex-col h-full mb-2">
        <TableLayout :header = "headerCounterPerformance" :items = "paginatedItems" />
    </div>
    
    <div class="bg-pure-white border border-gray w-full h-auto p-2 rounded-lg flex items-center">
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
  startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    search: {
        type: String,
        required: true
    }
});


const headerCounterPerformance = ref([
    'Counter',
    'Counter Personnel',
    'Total Served Count',
    'Abandonment Count',
    'Average Waiting Time',
    'Average Serving Time',
    'Average Resolution Time',
])

const itemList = ref([])
const emit = defineEmits(['pageChanged'])

// Filter Search
const filteredData = computed(() => {
  if (!props.search) return itemList.value;

  const filtered = itemList.value.filter((item) => {
    // Convert each item to a single string of all values and check if it includes the search query
    return Object.values(item).some(value => {
      if(value != null)
        return value.toString().toLowerCase().includes(props.search.toLowerCase())
    });
  });
  return filtered
});

const paginatedItems = computed(() => {
    if (!itemList.value || itemList.value.length === 0) {
        return []; // Return an empty array if itemList is not available
    }
    const start = (props.currentPage - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    const paginated = filteredData.value.slice(start, end);
    return paginated
});

const getStatistics = async(startDate, endDate) => {
    try {
        const token = localStorage.getItem('jwtadmin')
        const response = await fetch(`/api/statistics?start=${startDate}&end=${endDate}&type=all-counter-performance`, { 
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

const currentPage = ref(props.currentPage);
const totalItems = computed(() => filteredData.value.length);
const route = useRoute();

const handlePageChange = (newPage) => {
    currentPage.value = newPage; // Update local current page
    emit('pageChanged', newPage); // Emit to parent
};


watch(() => props.currentPage, (newVal) => {
    currentPage.value = newVal;
});

watch([() => props.startDate, () => props.endDate], async ([newStartDate, newEndDate]) => {
    if(!newStartDate && !newEndDate) return
    itemList.value = await getStatistics(newStartDate, newEndDate)
}, {immediate: true})

watch(() => filteredData.value, (data) => {
    emit('update:data', data, 'Counter Performance')
})


</script>