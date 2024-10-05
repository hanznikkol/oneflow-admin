<template>
    <div class="flex">
      <input id="radio1" name="segmented" type="radio" class="hidden" v-model="selected" value="Open">
      <label for="radio1" :class="labelClass('Open')">Open</label>
  
      <input id="radio5" name="segmented" type="radio" class="hidden" v-model="selected" value="Closed">
      <label for="radio5" :class="labelClass('Closed')">Closed</label>
    </div>
  </template>
  
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String
    }
})

const selected = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])


const labelClass = (value) => {
    return selected.value === value
        ? 'bg-primary text-[0.85rem] text-white cursor-default px-4 py-1 font-bold border-2 border-primary'
        : 'bg-pure-white text-[0.85rem] text-primary cursor-pointer px-4 py-1 font-bold border-2 border-primary hover:bg-accent transition duration-200';
}

watch(() => selected.value, (newSelected) => {
    emit('update:modelValue', newSelected)
})

watch(() => props.modelValue, (modelValue) => {
    selected.value = modelValue
})
</script>
  
<style scoped>
/* Add border-radius and handle adjacent label borders */
label:first-of-type {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
}

label:last-of-type {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
}

label + label {
margin-left: -2px; /* Removes double borders between labels */
}
</style>
  