<template>
    <div class="text-sm flex items-center justify-between gap-1 rounded-lg w-full lg:w-auto h-10 px-2 border border-[#ddd] duration-200 hover:border-[#aaaeb7] focus-within:border-[#aaaeb7]">
        <component class="w-4 h-4" :is = "IconSearch"/>

        <input
            v-model = "searchQuery"
            type="text"
            placeholder="Search"
            class="flex flex-1 outline-none"
        />

        <button 
            :class= "{ 'invisible': searchQuery.length === 0 }"
            @click="clearSearch" 
            class=" focus:outline-none"
        >  
            <component class="w-5 h-5" :is="IconClear"/>
        </button>
        
    </div>
</template>

<script setup>
import { ref } from 'vue';
//Icon Search
import IconSearch from '../../icons/statistics_icons/IconSearch.vue';
import IconClear from '../../icons/statistics_icons/IconClear.vue';

const searchQuery = ref('');

const clearSearch = () => {
    searchQuery.value = '';
};
</script>