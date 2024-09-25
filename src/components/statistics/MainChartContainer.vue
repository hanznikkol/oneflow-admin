<template>
    <!-- Top Container -->
    <div class="w-full h-[10%] flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-lg">
        <!-- Dropdown and Download Buttons -->
        <div class="w-full h-auto flex flex-row items-center gap-2">
            <DropdownBoxContainer
                :options="rowOptions"
                v-model="selectedRows"
                size="w-full lg:w-36 h-9"
                @update:modelValue="onRowsChange"
            />
            <!-- PDF -->
            <ButtonContainer
                bgColorClass = "bg-pdf-red hover:bg-[#C53A38]"
                text="PDF"
                textClass = "text-xs lg:text-sm font-bold text-white"
                sizeClass = "w-full lg:w-24 h-8 px-2"
                buttonRadius = "rounded-lg"
                :icon = 'IconPDF'
            />
            <!-- Excel -->
            <ButtonContainer
                bgColorClass = "bg-excel-green hover:bg-[#207848]"
                text="Excel"
                textClass = "text-xs lg:text-sm font-bold text-white"
                sizeClass = "w-full lg:w-24 h-8 px-2"
                buttonRadius = "rounded-lg"
                :icon = 'IconExcel'
            />
        </div>
    </div>

    <!-- Middle Container -->
    <div class="flex flex-1 w-full items-center justify-center flex-col">
        <!-- Header -->
        <div class="rounded-t-lg bg-pure-white flex flex-col lg:flex-row flex-wrap gap-2 w-full items-center justify-between p-2">  
            <!-- Tab Layout -->
            <TabLayout />
            <!-- Header Controls -->
            <div class=" flex-col md:flex-row flex flex-1 w-full items-center justify-end gap-2">
                <!-- Select Admin -->
                <DropdownBoxContainer
                    icon = "IconAdmin"
                    v-if = "isGraphReportActive"                   
                    v-model= "selectedCounterOption"
                    :options = "listCounters"
                />
                <!-- Dropdown (For Graph) -->
                <DropdownBoxContainer
                    v-if = "isGraphReportActive"                   
                    v-model="selectedOption"
                    :options = "sections"
                />
                <!-- Input Search (First 3 tabs) -->
                <InputSearch
                    v-else
                />
                <!-- Date Picker -->
                <VueDatePicker 
                    v-model = "selectedDate"
                    placeholder = "Select date"
                    :multi-calendars="{solo: true}"
                    :format = "dateFormat"
                    :clearable = "true"
                    range 
                />
                    
            </div>
        </div>
        
        <!-- Table and Graphs (Tab Layout) -->
        <RouterView 
            :current-page="currentPage" 
            :items-per-page="itemsPerPage" 
            @pageChanged="handlePageChange"
        />
    </div>
    
</template>
    
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

//Components
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import TabLayout from './subcomponents/TabLayout.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import InputSearch from './subcomponents/InputSearch.vue';
//Button Icons
import IconPDF from '../icons/statistics_icons/export_icons/IconPDF.vue';
import IconExcel from '../icons/statistics_icons/export_icons/IconExcel.vue';
//Date Picker Library
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment';

//Changes the Header Options
const route = useRoute();
const router = useRouter();
const isGraphReportActive = computed (() => {
    return route.path.includes('/statistics/graphreport');
})

//Props
const props = defineProps({
    sections: {
        type: Array,
        required: true
    }
})

//Filter Rows
const rowOptions = ref(['10 rows', '20 rows', '50 rows', '100 rows']);
const selectedRows = ref(rowOptions.value[0]);
const onRowsChange = (newValue) => {
    console.log('Selected Rows:', newValue); // Debugging log
    selectedRows.value = newValue; // Update selected rows
    itemsPerPage.value = parseInt(newValue.split(' ')[0]); // Update items per page
};

// Watch tab change to reset rows
watch(
    () => route.path, // Watch the route path to detect tab change
    (newPath) => {
        console.log('Route path changed:', newPath); // Debugging: see what the new path is
        console.log('Tab changed, resetting rows to 10');
        selectedRows.value = rowOptions.value[0]; // Reset to '10 rows'
        itemsPerPage.value = parseInt(selectedRows.value.split(' ')[0]); // Update items per page
    }
);

//List of Counters
const listCounters = ref([{label: 'All', type: ''}])

const selectedCounterOption = ref()

//Date
const selectedOption = ref({})
const selectedDate = ref('')
const dateFormat = 'MMM. d yyyy';

const formatStartEndDate = (date) => {
    const startDate = moment(date[0]).format('YYYY-MM-DD')
    const endDate = moment(date[1]).format('YYYY-MM-DD')
    return [startDate, endDate]
}

const getCounters = async () => {
    const token = localStorage.getItem('jwt')
    const response = await fetch(`/api/counters`, { 
        method: 'GET', 
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    if(!response.ok) return alert(`An error occured: ${data.error}`)

    const counters = data.counters.map(row=> ({label: row.Counter, type: row.adminType}))
    return counters
}

onMounted(async() => {
    const counters = await getCounters()
    listCounters.value = listCounters.value.concat(counters)
    if(listCounters.value.length > 0) 
        selectedCounterOption.value = listCounters.value[0]
    //set default date and option
    const endDate = new Date();
    const startDate = new Date(new Date().setDate(endDate.getDate() - 30));
    selectedDate.value = [startDate, endDate];

    // if query has a value for type, set it as the selected option
    if(route.query.t) 
        selectedOption.value = props.sections.find(option => option.type == route.query.t)
    else selectedOption.value = props.sections[0]
})

//Pagination Function
const currentPage = ref(1);
const itemsPerPage = ref(10); // Initialize with a default

const handlePageChange = (newPage) => {
    console.log('Current Page Changed:', newPage); // Debugging log
    currentPage.value = newPage; // Update the current page value
};

watch([() => route.path, () => selectedCounterOption.value, () => selectedOption.value, () => selectedDate.value], ([path, newCounterOption, newOption, newDate]) => {
    if(!newDate) return
    const formattedDate = formatStartEndDate(newDate)
    let newPath = `${path}?sd=${formattedDate[0]}&ed=${formattedDate[1]}`
    if (route.path === '/statistics') {
        return router.replace('/statistics/servingtime');
    }
    else if(route.path === '/statistics/graphreport') {
        newPath += `&c=${newCounterOption.type}&t=${newOption.type}`
    }
    router.replace(newPath)
})
</script>


<style>
:root {
    --dp-font-family: "Inter", sans-serif;
    --dp-border-radius: 8px; 
    
     /*Font sizes*/
     --dp-font-size: .9rem; /*Default font-size*/
    --dp-preview-font-size: 0.6rem; /*Font size of the date preview in the action row*/
    --dp-time-font-size: 0.6rem; /*Font size in the time picker*/
    --dp-cell-padding: 5px;
    --dp-common-padding: 5px;
    --dp-input-padding: 8px 15px 8px 12px;
}

.dp__theme_light{
    --dp-text-color: #00306E;
    --dp-icon-color: #000000;
}
</style>
