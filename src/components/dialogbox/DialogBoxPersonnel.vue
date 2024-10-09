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
                            <h1 class="text-sm">Role Type
                                <span v-if="isSaved && currentItem.adminType.isChanged" class="ms-2 text-green-400">Saved</span>
                                <span v-if="currentItem.adminType.value === ''" class="ms-2 text-red-600">Field Required</span>
                            </h1>
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
                            :showError = "currentItem.lastName.value.trim() === ''"
                        />

                        <!-- Email -->
                        <DialogBoxInput
                            label="Email"
                            type="email"
                            v-model="currentItem.email.value"
                            id="email"
                            placeholder="example@mail.com"
                            :showSave="isSaved && currentItem.email.isChanged"
                            :showError = "currentItem.email.value.trim() === ''"
                        />
                        <DialogBoxInput
                            label="Password"
                            type="password"
                            v-model="currentItem.password.value"
                            id="password"
                            placeholder=""
                            :showSave="isSaved && currentItem.password.isChanged"
                            :showError="mode === 'add' && currentItem.password.value.trim().length === 0"
                        />
                    </div>

                    <!-- Right column -->
                    <div class="flex flex-col gap-2 w-full h-full flex-grow">
                        <!-- Counter No -->
                        <div class="flex flex-col gap-2 w-full h-auto">
                            <label for="counterNo" class="text-sm">Role No.<span v-if="isSaved && currentItem.counterNo.isChanged" class="ms-2 text-green-400">Saved</span></label>
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
                            :showError = "currentItem.firstName.value.trim() === ''"
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
                <div class="w-full" v-if="mode === 'edit' && item.Status != 'Online'">
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
import { computed, onMounted, reactive, ref, toRef, watch } from 'vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
import DialogBoxInput from './subcomponents/DialogBoxInput.vue';
import { state } from '../../../socket';

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


const item = toRef(props.item)
const isSaved = ref(false)

const adminTypes = ref([
    'Cashier',
    'Registrar',
    'Admission',
]);

const adminTypeOptions = computed(() => {
    const adminTypeOptions = adminTypes.value
    if(state.adminInfo.permission == 'system')
        adminTypeOptions.push('Admin')
    return adminTypeOptions
})

const emitUpdate = () => {
    const valuesToUpdate = {};
    // get all the updated values
    Object.keys(currentItem).forEach(k => {
        // set changed value
        currentItem[k].isChanged = currentItem[k].value != (item.value[k] ? item.value[k] : '')
        
        // if changed, add to values to update
        if(currentItem[k].isChanged) {
            valuesToUpdate[k] = currentItem[k].value
        }
    })

    if(!isRequiredValuesNotEmpty()) return
    isSaved.value = false // reset 
    emit('update', valuesToUpdate, () => {
        // success callback
        isSaved.value = true
        Object.keys(valuesToUpdate).forEach(k=> {
            item.value[k] = valuesToUpdate[k]
        })
    })
}
const emitAdd = () => {
    if(!isRequiredValuesNotEmpty() || currentItem.password.value.trim().length == 0) return
    const personnel = {
        adminType: currentItem.adminType.value,
        firstName: currentItem.firstName.value.trim(),
        lastName: currentItem.lastName.value.trim(),
        password: currentItem.password.value.trim(),
        email: currentItem.email.value.trim(),
        phone: currentItem.phone.value.trim(),
        counterNo: currentItem.counterNo.value.trim()
    }
    emit('add', personnel, () => {
        emitClose()
    })
}

const isRequiredValuesNotEmpty = () => {
    // check if any required fields have empty values
    const emptyRequiredValues = Object.keys(currentItem).filter((k)=>
        currentItem[k].required && currentItem[k].value.trim() === ''
    )

    if(emptyRequiredValues.length > 0) return false
    return true
}

const currentItem = reactive({
    adminType: {
        value: adminTypeOptions.value[0], 
        isChanged: false,
        required: true,
    },
    lastName: {
        value: '', 
        isChanged: false,
        required: true,
    },
    email: {
        value: '', 
        isChanged: false,
        required: true,
    },
    firstName: {
        value: '', 
        isChanged: false,
        required: true,
    },
    counterNo: {
        value: '', 
        isChanged: false,
        required: false,
    }, 
    phone: {
        value: '', 
        isChanged: false,
        required: false,
    }, 
    password: {
        value: '',
        isChanged: false,
        required: false,
    }
})



onMounted(async ()=> {
    // if in edit mode
    if(item.value && item.value.adminID != undefined) {
        currentItem.adminType.value = adminTypeOptions.value.find(adminType => adminType == item.value.adminType)
        currentItem.lastName.value = item.value.lastName
        currentItem.firstName.value = item.value.firstName
        currentItem.email.value = item.value.email
        currentItem.counterNo.value = item.value.counterNo
        currentItem.phone.value = item.value.phone
    }
    // else in create mode
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
