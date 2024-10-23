<template>
    <div class="w-full h-full flex flex-col">
        <!-- Buttons -->
        <div class="w-full h-auto flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-t-xl">
            <div class="w-[40%] items-center justify-start h-auto flex gap-4">
                <DropdownBoxContainer
                    :options = "rowOptions"
                    v-model= "selectedRows"
                    size = "w-full lg:w-36 h-9"
                />

                
            <VueDatePicker 
                class="flex-1"
                v-model = "selectedDate"
                placeholder = "Select date"
                :multi-calendars="{solo: true}"
                :format = "dateFormat"
                :clearable = "true"
                :enable-time-picker="false"
                range 
            />
            </div>
        </div>
        <!-- Table -->
        <div class="relative w-full flex flex-col h-full">
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment';
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

const tableHeaders = ref(['Message', 'Date', 'Reaction', ' '])
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

const getFeedbacks = async(startDate, endDate) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        let request = `/api/feedbacks`
        if(startDate && endDate) {
            request += `?sd=${startDate}&ed=${endDate}`
        }
        const response = await fetch(request, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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

const selectedDate = ref('')
const dateFormat = 'MMM. d yyyy';

const formatStartEndDate = (date) => {
    const startDate = moment(date[0]).format('YYYY-MM-DD')
    const endDate = moment(date[1]).format('YYYY-MM-DD')
    return [startDate, endDate]
}

onMounted(async () => {
    tableItems.value = await getFeedbacks()
    console.log(tableItems.value)
})

watch(() => selectedDate.value, async (newDate) => {
    if(!newDate || newDate.length == 0) return
    const formattedDate = formatStartEndDate(newDate)
    tableItems.value = await getFeedbacks(formattedDate[0], formattedDate[1])
})

const totalItems = computed(() => tableItems.value.length);
</script>