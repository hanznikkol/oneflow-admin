<template>
    <div class="w-full h-full flex flex-col">
        <!-- Buttons -->
        <div class="w-full h-auto flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-t-xl">
            <div class="w-auto h-full">
                <DropdownBoxContainer
                    :options = "rowOptions"
                    v-model= "selectedRows"
                    size = "w-full lg:w-36 h-9"
                />
            </div>
        </div>
        <!-- Table -->
        <div class="w-full h-full flex-1">
            <TableFeedback 
                :headers="tableHeaders"
                :items="paginatedItems"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                @showFeedback="showFeedbackDialog"
            />
        </div>
    </div>
    
    <!-- Pagination -->
    <div class="bg-pure-white w-full h-auto p-2 rounded-lg flex items-center">
        <Pagination 
            :itemsPerPage = "itemsPerPage"
            :currentPage = "currentPage"
            :totalItems = "totalItems"
            @update:currentPage = "handlePageChange"
        />
    </div>

     <!-- Show Dialog Box -->
     <DialogBoxFeedback 
        :feedback="selectedFeedback"
        v-if="isFeedbackVisible"  
        @close="hideFeedbackDialog"
    />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import Pagination from '../pagination/Pagination.vue';
import TableFeedback from './subcomponents/TableFeedback.vue';
import DialogBoxFeedback from '../dialogbox/DialogBoxFeedback.vue';

const rowOptions = ref(['10 rows', '20 rows', '50 rows', '100 rows'])
const selectedRows = ref(rowOptions.value[0]);

//Show Feedback dialog
const isFeedbackVisible = ref(false)
const selectedFeedback = ref({})
const showFeedbackDialog = (item) => {
    selectedFeedback.value = item // Optional: Use the item
    isFeedbackVisible.value = true;  // Make dialog visible
};
const hideFeedbackDialog = () => {
    isFeedbackVisible.value = false;
    selectedFeedback.value = {}
}

const tableHeaders = ref(['Message', 'Date', 'Reaction', 'Phone', ' '])
const tableItems = ref([]);

const currentPage = ref(1)
const itemsPerPage = ref(10)
// Compute paginated items
const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return tableItems.value.slice(start, end);
});


const handlePageChange = (page) => {
    currentPage.value = page;
};

watch(selectedRows, (newRows) => {
    itemsPerPage.value = parseInt(newRows);
});

const getFeedbacks = async() => {
    try{
        const request = `/api/feedbacks`
        const response = await fetch(request, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }, 
        })
        const data = await response.json()
        if(!response.ok) return alert(data.error)
        return data.feedbacks
    }
    catch(err){
        console.error(err)
    }
}

onMounted(async () => {
    tableItems.value = await getFeedbacks()
    console.log(tableItems.value)
})

const totalItems = computed(() => tableItems.value.length);
</script>