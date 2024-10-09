<template>
    <div 
    @click = "focusInput"
    class="cursor-text flex flex-row items-center w-full gap-2 bg-main-gray py-4 px-2 rounded-lg">
        <!-- Icon -->
        <div class="w-9 h-9 flex items-center justify-center bg-pure-white rounded-lg p-1">
            <component :is="inputProps.icon"/>
        </div>
        <!-- Input -->
        <div class="bg-main-gray w-full">
            <input
                :type="inputProps.type"
                :placeholder="inputProps.placeholder"
                ref = "inputField"
                @input="updateValue($event)"
                class="w-full text-base bg-transparent border-none focus:outline-none focus:bg-transparent" 
            />
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

//Input Props
const inputProps = defineProps({
    modelValue: {
        type: String,
    },
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type:String,
        default: ''
    },
    //Icon
    icon: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['update:modelValue'])

//Focus in whole container
const inputField = ref(null)
const focusInput = () => { 
    if (inputField.value) {
        inputField.value.focus()
    }
}

const updateValue = (event) => {
    emit('update:modelValue', event.target.value)
}
</script>