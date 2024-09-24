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

const emit = defineEmits()

const headerCounterPerformance = ref([
    'Counter',
    'Counter Personel',
    'Total Served Count',
    'Average Waiting Time',
    'Average Serving Time',
    'Average Total Time',
])

const itemList = ref([
    {
        'Counter': 'Cashier',
        'Counter Personel': 'Personel A',
        'Total Served Count': 150,
        'Average Waiting Time': '5 mins',
        'Average Serving Time': '10 mins',
        'Average Total Time': '15 mins',
    },
    {
        Counter: 'Registrar',
        'Counter Personel': 'Personel B',
        'Total Served Count': 120,
        'Average Waiting Time': '4 mins',
        'Average Serving Time': '9 mins',
        'Average Total Time': '13 mins',
    },
])

for (let i = 1; i <= 50; i++) {
    itemList.value.push({
      'Counter': `Counter ${i}`, // Unique counter name
      'Counter Personel': `Personel ${String.fromCharCode(64 + (i % 26 || 26))}`, // Cycles through alphabet for personnel names
      'Total Served Count': Math.floor(Math.random() * 100) + 100, // Random count between 100 and 200
      'Average Waiting Time': `${Math.floor(Math.random() * 6) + 3} mins`, // Random time between 3 and 8 mins
      'Average Serving Time': `${Math.floor(Math.random() * 10) + 5} mins`, // Random time between 5 and 15 mins
      'Average Total Time': `${Math.floor(Math.random() * 5) + 10} mins`, // Random time between 10 and 15 mins
    });
  }

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