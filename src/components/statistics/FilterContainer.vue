<template>
    <div class="w-full h-[12%] flex justify-between items-center bg-pure-white rounded-xl p-2">
        <div class="flex-1">
            <DropdownBox
                :options = "rowOptions"
                v-model= "selectedRows"
                size = "w-full md:w-48 lg:w-48"
            />
        </div>
        
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DropdownBox from './subcomponents/DropdownBox.vue';

const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);
</script>