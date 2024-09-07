<template>
    <div class="flex flex-[2] items-center justify-center flex-col bg-pure-white rounded-xl">    
        <!-- Header -->
        <div class="flex flex-col lg:flex-row flex-wrap gap-2 h-auto w-full items-center justify-between p-2">
            
            <!-- Tab Layout -->
            <TabLayout/>

            <!-- Header Controls -->
            <div class="flex-col md:flex-row flex flex-1 w-full items-center justify-end gap-2">
                <!-- Select Admin -->
                <DropdownBox
                    icon = "IconAdmin"
                    v-if = "isGraphReportActive"                   
                    v-model="selectedOption"
                    :options = "sections.map(section => section.label)"
                />
                <!-- Dropdown (For Graph) -->
                <DropdownBox
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

        <!-- Charts -->
        <div class="w-full min-h-svh lg:min-h-full lg:flex-[2] bg-accent">
            <RouterView/>
        </div>

    </div>
</template>
    
<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';

//Components
import TabLayout from './subcomponents/TabLayout.vue';
import DropdownBox from './subcomponents/DropdownBox.vue';
import InputSearch from './subcomponents/InputSearch.vue';

//Icons
import IconAdmin from '../icons/statistics_icons/IconAdmin.vue';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

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
