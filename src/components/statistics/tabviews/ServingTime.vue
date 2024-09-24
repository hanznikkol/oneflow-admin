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

const emit = defineEmits()
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
    'Shortest Total Time',
    'Longest Waiting Time',
    'Longest Serving Time',
    'Longest Total Time',
    'Average Waiting Time',
    'Average Serving Time',
    'Average Total Time'
])

// List of items corresponding to the headers
const itemList = ref([
    {
        'Counter': 'Cashier',
        'Shortest Waiting Time': '2 mins',
        'Shortest Serving Time': '3 mins',
        'Shortest Total Time': '5 mins',
        'Longest Waiting Time': '10 mins',
        'Longest Serving Time': '8 mins',
        'Longest Total Time': '18 mins',
        'Average Waiting Time': '5 mins',
        'Average Serving Time': '5.5 mins',
        'Average Total Time': '10.5 mins'
    },
    {
        'Counter': 'Registrar',
        'Shortest Waiting Time': '1 min',
        'Shortest Serving Time': '2 mins',
        'Shortest Total Time': '3 mins',
        'Longest Waiting Time': '12 mins',
        'Longest Serving Time': '9 mins',
        'Longest Total Time': '21 mins',
        'Average Waiting Time': '6 mins',
        'Average Serving Time': '5 mins',
        'Average Total Time': '11 mins'
    },

]);

for (let i = 1; i <= 50; i++) {
    itemList.value.push({
      'Counter': `Counter ${i}`,
      'Shortest Waiting Time': `${Math.floor(Math.random() * 5) + 1} mins`,
      'Shortest Serving Time': `${Math.floor(Math.random() * 5) + 2} mins`,
      'Shortest Total Time': `${Math.floor(Math.random() * 10) + 3} mins`,
      'Longest Waiting Time': `${Math.floor(Math.random() * 10) + 6} mins`,
      'Longest Serving Time': `${Math.floor(Math.random() * 8) + 4} mins`,
      'Longest Total Time': `${Math.floor(Math.random() * 15) + 10} mins`,
      'Average Waiting Time': `${Math.floor(Math.random() * 6) + 4} mins`,
      'Average Serving Time': `${(Math.random() * 3 + 3).toFixed(1)} mins`,
      'Average Total Time': `${(Math.random() * 10 + 8).toFixed(1)} mins`,
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