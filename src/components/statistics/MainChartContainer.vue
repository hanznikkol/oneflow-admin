<template>
    <!-- Top Container -->
    <div class="w-full h-[10%] flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-lg">
        <!-- Dropdown and Download Buttons -->
        <div class="w-full h-auto flex flex-row items-center gap-2">
            <DropdownBoxContainer
                :options="rowOptions"
                v-model="selectedRows"
                size="w-full lg:w-36 h-9"
            />
            <!-- PDF -->
            <ButtonContainer
                @click="generatePDF"
                bgColorClass = "bg-pdf-red hover:bg-[#C53A38]"
                text="PDF"
                textClass = "text-xs lg:text-sm font-bold text-white"
                sizeClass = "w-full lg:w-24 h-8 px-2"
                buttonRadius = "rounded-lg"
                :icon = 'IconPDF'
            />
            <!-- Excel -->
            <ButtonContainer
                @click="exportToExcel"
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
            <div class="flex-col md:flex-row flex flex-1 w-full items-center justify-end gap-2">
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
                    v-model="searchQuery"
                    v-else
                />
                <!-- Date Picker -->
                <VueDatePicker 
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
        
        <!-- Table and Graphs (Tab Layout) -->
        <div class="relative w-full flex flex-col h-full" ref="contentToPrint">
            <RouterView 
                :search="searchQuery"
                :current-page="currentPage" 
                :items-per-page="itemsPerPage" 
                @update:data="updateData"
                @pageChanged="handlePageChange"
            /> 
        </div>

    </div>
    
</template>
    
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import * as XLSX from 'xlsx';
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

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

//Changes the Header Options
const route = useRoute();
const router = useRouter();
const isGraphReportActive = computed (() => {
    return route.path.includes('/statistics/graphreport');
})

const contentToPrint = ref()
const data = ref([])
const currStatistic = ref('Serving Time')

const updateData = (updatedData, selectedStatistic) =>{
    data.value = updatedData
    currStatistic.value = selectedStatistic
}

//Props
const props = defineProps({
    sections: {
        type: Array,
        required: true
    }
})

//Filter Search
const searchQuery = ref('')
//Filter Rows
const rowOptions = ref(['10 rows', '20 rows', '50 rows', '100 rows']);
const selectedRows = ref(rowOptions.value[0]);
const onRowsChange = (newValue) => {
    console.log('Selected Rows:', newValue); // Debugging log
    selectedRows.value = newValue; // Update selected rows
    currentPage.value  = 1
    itemsPerPage.value = parseInt(newValue.split(' ')[0]); // Update items per page
};

watch(() => selectedRows.value, onRowsChange)

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
    const token = localStorage.getItem('jwtadmin')
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

// PDF CONVERT
const generatePDF = () => {
    const doc = new jsPDF();

    const formattedDate = formatStartEndDate(selectedDate.value)

    // Add title
    doc.setFontSize(16);
    doc.text(`${currStatistic.value} Report`, 20, 20);
    doc.setFontSize(12)
    doc.text(`${formattedDate[0]} to ${formattedDate[1]}`, 20, 28);

    // Define the table columns
    const columns = Object.keys(data.value[0])

    // Map the tableData to the table rows
    const rows = data.value.map(d => Object.values(d))

    // Add the table to the PDF
    console.log(columns, rows)
    doc.autoTable({
        head: [columns],  // Column headers
        body: rows,       // Table data
        startY: 36,
        styles: {
            fontSize: 8,   // Global font size for the table
        },
        headStyles: {
            fontSize: 9,   // Font size for the header
        },
        bodyStyles: {
            fontSize: 8,   // Font size for the body
        }       // Y-position for the table
    });

    // Open the print dialog for PDF
    doc.output('dataurlnewwindow');
}

// GENERATE EXCEL
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(data.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Export the Excel file
  XLSX.writeFile(workbook, `${currStatistic.value}-${formatStartEndDate(selectedDate.value)}.xlsx`);
}

onMounted(async() => {
    const counters = await getCounters()
    listCounters.value = listCounters.value.concat(counters)
    if(listCounters.value.length > 0) 
        selectedCounterOption.value = listCounters.value[0]

    // if query has a value for type, set it as the selected option
    if(route.query.t) 
        selectedOption.value = props.sections.find(option => option.type == route.query.t)
    else selectedOption.value = props.sections[0]

    // if query has a selected value, set it as the selectedDate
    if(route.query.sd && route.query.ed) 
        selectedDate.value = [route.query.sd, route.query.ed]
    else {
        //set default date and option
        const endDate = new Date();
        const startDate = new Date(new Date().setDate(endDate.getDate() - 30));
        selectedDate.value = [startDate, endDate];
    }
})

//Pagination Function
const currentPage = ref(1);
const itemsPerPage = ref(10); // Initialize with a default

const handlePageChange = (newPage) => {
    console.log('Current Page Changed:', newPage); // Debugging log
    currentPage.value = newPage; // Update the current page value
};

watch([() => route.path, () => selectedCounterOption.value, () => selectedOption.value, () => selectedDate.value], ([path, newCounterOption, newOption, newDate]) => {
    if(!newDate || newDate.length == 0) return
    const formattedDate = formatStartEndDate(newDate)
    let newPath = `${path}?sd=${formattedDate[0]}&ed=${formattedDate[1]}`
    if (route.path === '/admin/statistics') {
        return router.replace('/admin/statistics/servingtime');
    }
    else if(route.path === '/admin/statistics/graphreport') {
        newPath += `&c=${newCounterOption.type}&t=${newOption.type}`
    }
    router.replace(newPath) // replace the url with filters

    currentPage.value = 1
    selectedRows.value = rowOptions.value[0]; // Reset to '10 rows'
    itemsPerPage.value = parseInt(selectedRows.value.split(' ')[0]);
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
