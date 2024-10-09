<template>
    <div class="flex w-full">
      <template v-for="(item, index) in props.items">
        <input :id="`radio${item}`" name="segmented" type="radio" class="hidden" v-model="selected" :value="item" />
        <label :for="`radio${item}`" :class="labelClass(item)">{{ item }}</label>
      </template>
    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String
    },
    items: {
        type: Array
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
  