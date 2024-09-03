<template>
    <div @mouseenter="hoverList" @mouseleave="hoverLeave" class="relative flex flex-1 flex-col gap-2 items-center justify-center"
    :class="{ 'border-b md:border-b-0 md:border-r  border-black': hasBorder }">
        
        <p class="text-label-gray text-xs lg:text-lg 2xl:text-2xl hover:cursor-default">{{ sectionProps.label }}</p>
        <h1 class="text-black text-base lg:text-3xl 2xl:text-5xl font-bold hover:cursor-default">{{ sectionProps.value }}</h1>  
    
        <!-- Transtion toggle -->
        <transition 
            enter-active-class="transition duration-100 ease-in"
            leave-active-class="transition duration-100 ease-out"
            enter-from-class="transform opacity-0 scale-90"
            enter-to-class="transform opacity-100 scale-100"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"   
        >   
            <!-- List -->
            <div v-if="showDropdown" class="absolute w-full left-0 top-full mt-3 bg-pure-white z-20 border border-[#ddd] rounded-md">
                <div class="flex flex-col p-2 z-20 gap-2 ">
                    <div v-for="item in items" :key="item.label" class="hover:text-xl hover:border-l-4 hover:border-secondary hover:pl-2 flex justify-between items-center">
                        <p class="text-black font-bold">{{ item.label }}</p>
                        <p class="text-label-gray">{{ item.value }}</p>
                    </div>             
                </div>
            </div>
        </transition>
    </div>

    
</template>

<script setup>
import { ref } from 'vue';
const sectionProps = defineProps({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    hasBorder: {
        type: Boolean
    }
})

const showDropdown = ref(false)

const hoverList = () => { showDropdown.value = true }
const hoverLeave = () => { showDropdown.value = false }


const items = ref([
    { label: 'Daily', value: '1000' },
    { label: 'Weekly', value: '5000' },
    { label: 'Monthly', value: '20000' },
    { label: 'Yearly', value: '240000' }
]);
</script>