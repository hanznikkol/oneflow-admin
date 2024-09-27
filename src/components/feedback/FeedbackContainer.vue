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
                @selection:changed="handleSelectionChanged"
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
        v-if="isFeedbackVisible"  
        @close="isFeedbackVisible = false"
    />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import Pagination from '../pagination/Pagination.vue';
import TableFeedback from './subcomponents/TableFeedback.vue';
import DialogBoxFeedback from '../dialogbox/DialogBoxFeedback.vue';

const rowOptions = ref(['10 rows', '20 rows', '50 rows', '100 rows'])
const selectedRows = ref(rowOptions.value[0]);

//Show Feedback dialog
const isFeedbackVisible = ref(false)
const showFeedbackDialog = (item) => {
    console.log("Item received for feedback:", item); // Optional: Use the item
    isFeedbackVisible.value = true;  // Make dialog visible
};

const tableHeaders = ref(['Message', 'Date', 'Reaction', 'Phone', ' '])
const tableItems = ref([
    { 
        Message: 'The kiosk was incredibly easy to use! I checked in within minutes and received my ticket promptly.', 
        Date: '2024-09-01', 
        Reaction: 'Very Good', 
        Phone: '555-0101',
    },
    { 
        Message: 'The check-in process was good, but I had to wait too long after that.', 
        Date: '2024-09-02', 
        Reaction: 'Good', 
        Phone: '555-0102' 
    },
    { 
        Message: 'It was an average experience. The kiosk worked, but it could have been clearer with the instructions.', 
        Date: '2024-09-03', 
        Reaction: 'Neutral', 
        Phone: '555-0103' 
    },
    { 
        Message: 'I encountered several issues during check-in. The kiosk was slow and unresponsive.', 
        Date: '2024-09-04', 
        Reaction: 'Bad', 
        Phone: '555-0104' 
    },
    { 
        Message: 'Very disappointing! The system crashed twice while I was trying to check in.', 
        Date: '2024-09-05', 
        Reaction: 'Very Bad', 
        Phone: '555-0105' 
    },
    { 
        Message: 'I liked the self-service feature. It saved time, and I had a pleasant experience overall.', 
        Date: '2024-09-06', 
        Reaction: 'Very Good', 
        Phone: '555-0106' 
    },
    { 
        Message: 'The waiting area was chaotic, but the kiosk helped streamline my check-in.', 
        Date: '2024-09-07', 
        Reaction: 'Good', 
        Phone: '555-0107' 
    },
    { 
        Message: 'Everything was average, but the interface was quite user-friendly.', 
        Date: '2024-09-08', 
        Reaction: 'Neutral', 
        Phone: '555-0108' 
    },
    { 
        Message: 'The service was slow, and I felt frustrated using the kiosk.', 
        Date: '2024-09-09', 
        Reaction: 'Bad', 
        Phone: '555-0109' 
    },
    { 
        Message: 'The kiosk was down for maintenance when I arrived. Very inconvenient.', 
        Date: '2024-09-10', 
        Reaction: 'Very Bad', 
        Phone: '555-0110' 
    },
]);



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

const totalItems = computed(() => tableItems.value.length);
</script>