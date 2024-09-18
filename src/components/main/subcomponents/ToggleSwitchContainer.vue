<template>
    <!-- Background -->
    <div
        @click="toggle"
        :class="{
            'bg-accent': toggleProps.modelValue,
            'bg-gray': !toggleProps.modelValue
        }"
        class="relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
    >
        <!-- Circle Knob -->
        <div
            :class="knobClass"
             class="absolute top-0 left-0 w-6 h-6 rounded-full shadow-md transition-transform duration-200 ease-in-out"
        >
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const toggleProps = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue']);

// Compute knob position and color based on modelValue
const knobClass = computed(() => 
    `absolute top-0 left-0 w-6 h-6 bg-[#00306E] rounded-full shadow-md transition-transform duration-200 ease-in-out ${toggleProps.modelValue ? 'translate-x-6' : 'translate-x-0'}`
);


const toggle = () => {
  emit('update:modelValue', !toggleProps.modelValue);
};
</script>