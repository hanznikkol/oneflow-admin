<template>
    <div class="w-full h-full mb-2">
        <TableLayout 
        :header = "headerCustomerJourney" 
        :items="paginatedItems" 
        :status-classes="statusClasses"
    />
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

const emit = defineEmits();

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

// Initialize itemList
const itemList = ref([]);

const statusClasses = ref({
    Completed: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center',
    Pending: 'bg-secondary text-black p-1 rounded w-16 h-auto flex items-center justify-center',
    Abandoned: 'bg-red-600 text-white p-1 rounded w-16 h-auto flex items-center justify-center',
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
