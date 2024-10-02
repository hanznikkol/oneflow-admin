<template>
    <div class="flex">
      <input id="radio1" name="segmented" type="radio" class="hidden" v-model="selected" value="Active">
      <label for="radio1" :class="labelClass('Active')">Active</label>
  
      <input id="radio5" name="segmented" type="radio" class="hidden" v-model="selected" value="Deleted">
      <label for="radio5" :class="labelClass('Deleted')">Deleted</label>
    </div>
  </template>
  
<script setup>
import { ref, watch } from 'vue';

const selected = ref('Active')

const emit = defineEmits(['update:selected'])

const labelClass = (value) => {
    return selected.value === value
        ? 'bg-primary text-[0.85rem] text-white cursor-default px-4 py-1 font-bold border-2 border-primary'
        : 'bg-pure-white text-[0.85rem] text-primary cursor-pointer px-4 py-1 font-bold border-2 border-primary hover:bg-accent transition duration-200';
}

watch(() => selected.value, (newSelected) => {
    emit('update:selected', newSelected)
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
  