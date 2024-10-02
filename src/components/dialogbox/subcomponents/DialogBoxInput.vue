<template>
    <div class="w-full h-auto flex flex-col gap-2">
        <label :for="id" class="text-sm">{{label}}
            <span v-if="showSave" class="ms-2 text-green-400">Saved</span>
            <span v-if="showError" class="ms-2 text-red-600">Field Required</span>
        </label>
        <input
            :id="id"
            :type="type"
            :value="modelValue"
            @input="updateValue"
            class="border border-[#ddd] text-sm rounded-lg h-10 px-2 duration-200 hover:border-[#aaaeb7]"
            :placeholder="placeholder"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text'
    },
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        required: true
    },
    showSave: {
        type: Boolean,
        default: false
    },
    showError: {
        type: Boolean,
        default: false
    }
});

// Emit to the parent when the input changes
const emit = defineEmits(['update:modelValue']);

// Simple update method to emit the value
const updateValue = (event) => {
    emit('update:modelValue', event.target.value);
};
</script>
