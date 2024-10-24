<template>
    <div class="relative w-full flex flex-col h-full mb-2">
        <TableLayout 
        :header = "headerCustomerJourney" 
        :items="paginatedItems" 
        :status-classes="statusClasses"
    />
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

const emit = defineEmits(['pageChanged'])

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
    'Services',
    'Status'
])

// Initialize itemList
const itemList = ref([]);

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

const statusClasses = ref({
    Completed: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center text-[.60rem] justify-center',
    Pending: 'bg-secondary text-black p-1 rounded w-16 h-auto flex items-center text-[.60rem] justify-center',
    Hold: 'bg-slate-400 text-white p-1 rounded w-16 h-auto flex items-center text-[.60rem] justify-center',
    Abandoned: 'bg-red-600 text-white p-1 rounded w-16 h-auto flex items-center text-[.60rem] justify-center',
});

const getStatistics = async(startDate, endDate) => {
    try {
        const token = localStorage.getItem('jwtadmin')
        const response = await fetch(`/api/statistics?start=${startDate}&end=${endDate}&type=all-customer-journey`, { 
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

const paginatedItems = computed(() => {
    if (!itemList.value || itemList.value.length === 0) {
        return []; // Return an empty array if itemList is not available
    }
    const start = (props.currentPage - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    const paginated =  filteredData.value.slice(start, end);
    return paginated
});

const currentPage = ref(props.currentPage);
const route = useRoute();

watch(() => props.currentPage, (newVal) => {
    currentPage.value = newVal;
});


const totalItems = computed(() => filteredData.value.length);

const handlePageChange = (newPage) => {
    currentPage.value = newPage; // Update local current page
    emit('pageChanged', newPage); // Emit to parent
};


watch([() => props.startDate, () => props.endDate], async ([newStartDate, newEndDate]) => {
    if(!newStartDate && !newEndDate) return
    itemList.value = await getStatistics(newStartDate, newEndDate)
}, {immediate: true})

watch(() => filteredData.value, (data) => {
    emit('update:data', data, 'Customer Journey')
})

</script>
