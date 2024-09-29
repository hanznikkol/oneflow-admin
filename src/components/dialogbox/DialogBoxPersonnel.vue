<template>
    <div class="fixed inset-0 flex justify-center items-center z-20">
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black opacity-50 transition-opacity duration-200"></div>

        <!-- Dialog Box -->
        <div class="flex flex-col relative bg-pure-white w-[80%] lg:w-[55%] max-h-[90svh] lg:h-auto rounded-lg">
            <!-- Main Content -->
            <div class="w-full gap-4 lg:flex-1 py-4 flex flex-col lg:justify-center px-4 overflow-y-auto">
                <label for="personnel" class="font-bold text-base lg:text-xl">
                    {{ mode === 'edit' ? 'Edit Personnel' : 'Create Personnel' }}
                </label>

                <!-- Form -->
                <div class="flex flex-col lg:flex-row justify-between gap-4 w-full h-full">
                    <!-- Left column -->
                    <div class="flex flex-col gap-2 w-full h-full flex-grow">
                        <!-- Dropdown Admin Type -->
                        <div class="w-full h-auto flex flex-col gap-2">
                            <h1 class="text-sm">Admin Type</h1>
                            <DropdownBoxContainer
                                size="w-full"
                                :options="announcedToOptions"
                                v-model="selectedAnnouncedTo"
                            />
                        </div>

                        <!-- Last Name -->
                        <DialogBoxInput
                            label="Last Name"
                            v-model="lastName"
                            id="lastName"
                            placeholder="E.g. Doe"
                        />

                        <!-- Email -->
                        <DialogBoxInput
                            label="Email"
                            type="email"
                            v-model="email"
                            id="email"
                            placeholder="example@mail.com"
                        />
                    </div>

                    <!-- Right column -->
                    <div class="flex flex-col gap-2 w-full h-full flex-grow">
                        <!-- Counter No -->
                        <div class="flex flex-col gap-2 w-full h-auto">
                            <label for="counterNo" class="text-sm">Counter No</label>
                            <input
                                id="counterNo"
                                type="text"
                                v-model="counterNo"
                                @input="validateCounterInput"
                                placeholder="E.g. 2"
                                class="border border-[#ddd] text-sm rounded-lg h-10 px-2 duration-200 hover:border-[#aaaeb7]"
                            />
                        </div>
                        
                        <!-- First Name -->
                        <DialogBoxInput
                            label="First Name"
                            v-model="firstName"
                            id="firstName"
                            placeholder="E.g. John"
                        />

                        <!-- Phone No -->
                        <div class="flex flex-col gap-2 w-full h-auto">
                            <label for="phone" class="text-sm">Phone No</label>
                            <input
                                id="phone"
                                type="text"
                                v-model="phone"
                                @input="validatePhoneInput"
                                placeholder="09*********"
                                class="border border-[#ddd] text-sm rounded-lg h-10 px-2 duration-200 hover:border-[#aaaeb7]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex-1 flex gap-4 w-full px-6 h-auto py-4 bg-gray">
                <DialogButtonContainer
                    text="Cancel"
                    textClass="text-base font-bold"
                    sizeClass="p-2 w-full"
                    bgColorClass="bg-pure-white hover:bg-light-gray"
                    buttonRadius="rounded-md"
                    shadowClass="shadow-2xl"
                    @click="emitClose"
                />

                <DialogButtonContainer
                    :text="mode === 'edit' ? 'Save' : 'Create'"
                    textClass="text-base text-black font-bold"
                    sizeClass="p-2 w-full"
                    buttonRadius="rounded-md"
                    shadowClass="shadow-2xl"
                />

                <!-- Delete Button (only visible in edit mode) -->
                <div class="w-full" v-if="mode === 'edit'">
                    <DialogButtonContainer
                        text="Delete"
                        textClass="text-base text-red-500 font-bold"
                        sizeClass="p-2 w-full"
                        bgColorClass="bg-pure-white hover:bg-light-gray"
                        buttonRadius="rounded-md"
                        shadowClass="shadow-2xl"
                        @click="handleDelete"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
import DialogBoxInput from './subcomponents/DialogBoxInput.vue';

// Props
const props = defineProps({
    showDialog: {
        type: Boolean
    },
    mode: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['close']);
const emitClose = () => emit('close');

const announcedToOptions = [
    'Cashier',
    'Registrar'
];

const selectedAnnouncedTo = ref(announcedToOptions[0]);
const lastName = ref('');
const email = ref('');
const firstName = ref('');
const counterNo = ref(''); // This is the Counter No field
const phone = ref(''); // This is the Phone No field

// Method to validate Counter No input
const validateCounterInput = (event) => {
    // Allow only numeric input and limit to 2 digits
    const inputValue = event.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    counterNo.value = inputValue;
};

// Method to validate Phone No input
const validatePhoneInput = (event) => {
    // Allow only numeric input and limit to 11 digits
    const inputValue = event.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    phone.value = inputValue;
};
</script>

<style>
/* Remove button in numeric type */
input[type='text'] {
    -moz-appearance: textfield; /* Firefox */
    -webkit-appearance: none; /* Chrome, Safari, Edge */
    appearance: none; /* All modern browsers */
}

/* Hide spinners in Firefox */
input[type='text']::-webkit-inner-spin-button,
input[type='text']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
