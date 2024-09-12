<template>
    <div @click="toggleDropdown" 
        class="relative cursor-pointer flex items-center justify-between gap-3 rounded-lg h-10 px-2 border border-[#ddd] duration-200 hover:border-[#aaaeb7] focus:border-[#aaaeb7]"
        :class="dropdownProps.size"
    >
        <!-- Icon or Prefix -->
        <div v-if="dropdownProps.prefix || dropdownProps.icon">
            <!-- Prefix -->
            <p v-if="dropdownProps.prefix" class="text-xs md:text-sm lg:text-base text-label-gray">{{ dropdownProps.prefix }}</p>
            <!-- Icon -->
            <component class="w-3 h-3 lg:w-4 lg:h-4" v-if="IconComponents" :is="IconComponents"/>
        </div>

        <!-- Text -->
        <div class="flex-1">
            <p class="text-sm text-primary">{{ dropdownProps.modelValue }}</p>
        </div>

        <!-- Dropdown Icon -->
        <div class="w-3 h-3 transition-transform duration-300" :class="{'rotate-180': isOpen}">
            <component class="w-full h-full" :is="IconArrowDown"/>
        </div>

        <!-- Transtion toggle -->
        <transition 
            enter-active-class="transition duration-100 ease-in"
            leave-active-class="transition duration-100 ease-out"
            enter-from-class="transform opacity-0 scale-90"
            enter-to-class="transform opacity-100 scale-100"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"   
        >
            <!-- Dropdown Menu -->
            <div v-if="isOpen" class="absolute w-full left-0 top-full mt-2 bg-pure-white z-20 border border-[#ddd] rounded-md">
                <!-- List -->
                    <ul class="z-20 rounded-md overflow-hidden" v-if= "options.length > 0">
                        <li 
                        v-for="option in options" 
                        :key="option" 
                        @click.stop="selectOption(option)"
                        class="cursor-pointer p-2 hover:bg-gray"
                        >
                        {{ option }}
                        </li>
                    </ul>
                <slot v-else/>
            </div>
        </transition>
        
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
//Icon
import IconArrowDown from '../../icons/statistics_icons/IconArrowDown.vue';
import IconCalendar from '../../icons/statistics_icons/IconCalendar.vue';
import IconAdmin from '../../icons/statistics_icons/IconAdmin.vue';

/*Props*/
const dropdownProps = defineProps({
    prefix: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: "w-full"
    },
    modelValue: {
        type: String,
        default: 'Select an Option'},
    //Menu Options
    options: {
        type: Array,
        default: () => []
    },
})

const emit = defineEmits(['updateSelectedOption'])

/* Icons */
const Icons = {
    IconCalendar,
    IconAdmin
}
const IconComponents = computed(() => {
    return Icons[dropdownProps.icon] || null
})

/*Toggle Dropdown */
const isOpen = ref(false)
const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

/* Menu Option */

// Dropdown options
const selectOption = (option) => {
    emit('update:modelValue', option)
  isOpen.value = false; // Close dropdown after selection
};


</script>