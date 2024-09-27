<template>
    <div class="text-sm flex items-center justify-between gap-1 rounded-lg w-full lg:w-auto h-10 px-2 border border-[#ddd] duration-200 hover:border-[#aaaeb7] focus-within:border-[#aaaeb7]">
        <component class="w-4 h-4" :is = "IconSearch"/>

        <input
            @input="updateValue($event)"
            :value="modelValue"
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
import { ref, watch } from 'vue';
//Icon Search
import IconSearch from '../../icons/statistics_icons/IconSearch.vue';
import IconClear from '../../icons/statistics_icons/IconClear.vue';

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: {
        type: String
    }
})

const searchQuery = ref('')

const clearSearch = () => {
    emit('update:modelValue', '')
};

const updateValue = (event) => {
    emit('update:modelValue', event.target.value)
}

watch(() => props.modelValue, (newQuery) => {
    searchQuery.value = newQuery
})
</script>