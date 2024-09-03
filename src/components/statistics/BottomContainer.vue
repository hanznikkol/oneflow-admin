<template>
    <div class="flex flex-[2] items-center justify-center flex-col bg-pure-white rounded-2xl p-4 gap-4">    
        <!-- Header -->
        <div class="flex flex-col lg:flex-row gap-2 h-auto w-full items-center justify-between">
            <!-- Text -->
            <div class="w-full justify-center lg:w-96">
                <h1 class="text-black text-base lg:text-xl 2xl:text-3xl font-bold">Summary Chart</h1>  
            </div>
            <!-- Dropdowns -->
            <div class="flex-col md:flex-row flex flex-1 w-full items-center justify-end gap-2">
                <VueDatePicker 
                    v-model = "selectedDate"
                    placeholder = "Select date"
                    :multi-calendars="{solo: true}"
                    :format = "dateFormat"
                    :clearable = "true"
                    range 
                />
                <DropdownBox                   
                    v-model="selectedOption"
                    :options = "sections.map(section => section.label)"
                />
            </div>
        </div>

        <!-- Graph -->
        <div class="w-full min-h-svh lg:min-h-full lg:flex-[2] bg-accent">
            
        </div>

    </div>
</template>
    
<script setup>
    import { ref, onMounted } from 'vue';
    import DropdownBox from './subcomponents/DropdownBox.vue';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'

    const selectedOption = ref('Select an option')
    const selectedDate = ref('')
    const dateFormat = 'MM-dd-yyyy'

    const props = defineProps({
        sections: {
            type: Array,
            require: true
        }
    })

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
    }

    .dp__theme_light{
        --dp-text-color: #00306E;
        --dp-icon-color: #000000;
    }
    
</style>
