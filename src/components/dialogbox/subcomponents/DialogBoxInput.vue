<template>
    <div class="w-full h-auto flex flex-col gap-2">
        <label :for="id" class="text-sm">{{ label }}</label>
        <input
            :id = "id"
            :type = "type"
            :v-model = "modelValue"
            @input="$emit('update:modelValue', modelValue)"
            class="border border-[#ddd] text-sm rounded-lg h-10 px-2 duration-200 hover:border-[#aaaeb7] "
            :placeholder="placeholder"
        />
    </div>
</template>

<script setup>

const inputProps = defineProps({
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
    }
})
</script>