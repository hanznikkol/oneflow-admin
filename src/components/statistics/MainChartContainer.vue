<template>
    <!-- Top Container -->
    <div class="w-full h-[10%] flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-lg">
        <!-- Dropdown and Download Buttons -->
        <div class="w-full h-auto flex flex-row items-center gap-2">
            <DropdownBoxContainer
                :options = "rowOptions"
                v-model= "selectedRows"
                size = "w-full lg:w-36 h-9"
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
    <div class="flex flex-1 w-full items-center justify-center flex-col ">
        <!-- Header -->
        <div class="rounded-t-lg bg-pure-white flex flex-col lg:flex-row flex-wrap gap-2 h-auto w-full items-center justify-between p-2">  
            <!-- Tab Layout -->
            <TabLayout/>
            <!-- Header Controls -->
            <div class=" flex-col md:flex-row flex flex-1 w-full items-center justify-end gap-2">
                <!-- Select Admin -->
                <DropdownBoxContainer
                    icon = "IconAdmin"
                    v-if = "isGraphReportActive"                   
                    v-model= "selectedAdmissionOption"
                    :options = "listAdmission"
                />
                <!-- Dropdown (For Graph) -->
                <DropdownBoxContainer
                    v-if = "isGraphReportActive"                   
                    v-model="selectedOption"
                    :options = "sections.map(section => section.label)"
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
        <RouterView/>
    </div>

    <!-- Bottom Container -->
    <div 
        v-if = "!isGraphReportActive"
        class="bg-pure-white w-full h-[10%] rounded-lg p-1">
        <div class="w-full h-full flex justify-end items-center">
            <ButtonContainer
                text="Next"
                textClass = "text-xs lg:text-sm font-bold"
                sizeClass = "w-24 h-9 px-2"
                buttonRadius = "rounded-lg"
            />
        </div>
        
    </div>
</template>
    
<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';

//Components
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import TabLayout from './subcomponents/TabLayout.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import InputSearch from './subcomponents/InputSearch.vue';
//Button Icons
import IconPDF from '../icons/statistics_icons/export_icons/IconPDF.vue';
import IconExcel from '../icons/statistics_icons/export_icons/IconExcel.vue';
//
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

//Changes the Header Options
const route = useRoute();
const isGraphReportActive = computed (() => {
    return route.path === '/statistics/graphreport';
})

//Props
const props = defineProps({
    sections: {
        type: Array,
        require: true
    }
})

//Filter Rows
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

//List of Admission
const listAdmission = ref([
    'Cashier',
    'Registrar'
])

const selectedAdmissionOption = ref('Select Admission')

//Date
const selectedOption = ref('Select an option')
const selectedDate = ref('')
const dateFormat = 'MMM. d yyyy';

onMounted(() => {
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
    selectedDate.value = [startDate, endDate];
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
