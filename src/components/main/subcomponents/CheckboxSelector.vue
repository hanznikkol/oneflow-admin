<template>
    <div
        @click="toggleCheck"
        :class="[
        'w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center cursor-pointer border-2 rounded duration-100',
        isChecked ? 'bg-secondary border-secondary' : 'bg-pure-white border-gray'
        ]"
        role="checkbox"
        aria-checked="isChecked"
    >

        <component
            v-if="isChecked"
            :is = "IconCheck"
            class="w-full h-full"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import IconCheck from '../../icons/main_icons/table/IconCheck.vue';

const emit = defineEmits(['update:checked']);
const props = defineProps({
    checked: Boolean
})

const isChecked = ref(props.checked)
const toggleCheck = () => {
    isChecked.value = !isChecked.value
    emit('update:checked', isChecked.value)
}

watch(() => props.checked, (newVal) => {
    isChecked.value = newVal;
});
</script>