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
                            <h1 class="text-sm">Admin Type<span v-if="isSaved && currentItem.adminType.isChanged" class="ms-2 text-green-400">Saved</span></h1>
                            <DropdownBoxContainer
                                size="w-full"
                                :options="adminTypeOptions"
                                v-model="currentItem.adminType.value"
                            />
                        </div>

                        <!-- Last Name -->
                        <DialogBoxInput
                            label="Last Name"
                            v-model="currentItem.lastName.value"
                            id="lastName"
                            placeholder="E.g. Doe"
                            :showSave="isSaved && currentItem.lastName.isChanged"
                        />

                        <!-- Email -->
                        <DialogBoxInput
                            label="Email"
                            type="email"
                            v-model="currentItem.email.value"
                            id="email"
                            placeholder="example@mail.com"
                            :showSave="isSaved && currentItem.email.isChanged"
                        />
                    </div>

                    <!-- Right column -->
                    <div class="flex flex-col gap-2 w-full h-full flex-grow">
                        <!-- Counter No -->
                        <div class="flex flex-col gap-2 w-full h-auto">
                            <label for="counterNo" class="text-sm">Counter No<span v-if="isSaved && currentItem.counterNo.isChanged" class="ms-2 text-green-400">Saved</span></label>
                            <input
                                id="counterNo"
                                type="text"
                                v-model="currentItem.counterNo.value"
                                @input="validateCounterInput"
                                placeholder="E.g. 2"
                                class="border border-[#ddd] text-sm rounded-lg h-10 px-2 duration-200 hover:border-[#aaaeb7]"
                            />
                        </div>
                        
                        <!-- First Name -->
                        <DialogBoxInput
                            label="First Name"
                            v-model="currentItem.firstName.value"
                            id="firstName"
                            placeholder="E.g. John"
                            :showSave="isSaved && currentItem.firstName.isChanged"
                        />

                        <!-- Phone No -->
                        <div class="flex flex-col gap-2 w-full h-auto">
                            <label for="phone" class="text-sm">Phone No<span v-if="isSaved && currentItem.phone.isChanged" class="ms-2 text-green-400">Saved</span></label>
                            <input
                                id="phone"
                                type="text"
                                v-model="currentItem.phone.value"
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
                    v-if="mode === 'edit'"
                    text="Save"
                    textClass="text-base text-black font-bold"
                    sizeClass="p-2 w-full"
                    buttonRadius="rounded-md"
                    shadowClass="shadow-2xl"
                    @click="emitUpdate"
                />

                <DialogButtonContainer
                    v-else
                    text="Create"
                    textClass="text-base text-black font-bold"
                    sizeClass="p-2 w-full"
                    buttonRadius="rounded-md"
                    shadowClass="shadow-2xl"
                    @click="emitAdd"
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
                        @click="emitDelete"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRef, watch } from 'vue';
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
    },
    item: {
        type: Object,
    }
});

const emit = defineEmits(['close', 'delete', 'update', 'add']);
const emitClose = () => emit('close');
const emitDelete = () => emit('delete')
const emitUpdate = () => {
    Object.keys(currentItem).forEach(k => {
        currentItem[k].isChanged = currentItem[k].value != item.value[k]
    })
    emit('update')
}
const emitAdd = () => emit('add')

const adminTypeOptions = [
    'Cashier',
    'Registrar',
    'Admission'
];

const item = toRef(props.item)
const isSaved = ref(true)

const currentItem = reactive({
    adminType: {value: adminTypeOptions[0], isChanged: false},
    lastName: {value: '', isChanged: false},
    email: {value: '', isChanged: false},
    firstName: {value: '', isChanged: false},
    counterNo: {value: '', isChanged: false}, // This is the Counter No field
    phone: {value: '', isChanged: false}, // This is the Phone No field
})


onMounted(async ()=> {
    if(item.value) {
        currentItem.adminType.value = adminTypeOptions.find(adminType => adminType == item.value.adminType)
        currentItem.lastName.value = item.value.lastName
        currentItem.firstName.value = item.value.firstName
        currentItem.email.value = item.value.email
        currentItem.counterNo.value = item.value.counterNo
        currentItem.phone.value = item.value.phone
    }
})

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
