<template>
    <div class="w-full h-full mb-2">
        <TableLayout 
        :header="headerCustomerJourney" 
        :items="paginatedItems" 
        :status-column="'Status'"
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
    'Created Date',
    'Start Serving',
    'Waiting Time',
    'Served Time',
    'Serving Time Time',
    'Total Time',
    'Status'
]);

// Initialize itemList
const itemList = ref([]);

// Loop to generate 50 items
for (let i = 0; i < 50; i++) {
    itemList.value.push({
        'Counter': i % 2 === 0 ? 'Cashier' : 'Registrar',
        'Processed By': i % 2 === 0 ? 'Personel A' : 'Personel B',
        'Queue No.': i + 1,
        'Created Date': `2024-09-0${(i % 30) + 1}`,
        'Start Serving': `2024-09-0${(i % 30) + 1} 10:${(i % 60).toString().padStart(2, '0')}`,
        'Waiting Time': `${Math.floor(Math.random() * 15) + 1} mins`,
        'Served Time': `${Math.floor(Math.random() * 15) + 1} mins`,
        'Serving Time Time': `${Math.floor(Math.random() * 20) + 1} mins`,
        'Total Time': `${Math.floor(Math.random() * 30) + 1} mins`,
        'Status': i % 3 === 0 ? 'Completed' : (i % 3 === 1 ? 'Pending' : 'Abandoned'),
    });
}

const statusClasses = ref({
    Completed: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center',
    Pending: 'bg-secondary text-black p-1 rounded w-16 h-auto flex items-center justify-center',
    Abandoned: 'bg-red-800 text-white p-1 rounded w-16 h-auto flex items-center justify-center',
});

const paginatedItems = computed(() => {
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

const fetchData = async () => {
    // Simulate fetching data. Replace this with your actual data fetching logic.
};

onMounted(() => {
    fetchData(); // Call the function to fetch data on component mount
});
</script>
