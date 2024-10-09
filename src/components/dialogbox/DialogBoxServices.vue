<template>
    <div class="fixed inset-0 flex justify-center items-center z-20">
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black opacity-50 transition-opacity duration-200"></div>

        <!-- Dialog Box -->
        <div class="flex flex-col relative bg-pure-white w-[75%] lg:w-[50%] max-h-auto lg:h-auto rounded-lg">
            <!-- Main Content -->
            <div class="w-full gap-4 lg:flex-1 py-4 flex flex-col px-4 overflow-y-auto">
                <label for="personnel" class="font-bold text-base lg:text-xl">
                    {{ mode === 'edit' ? 'Edit Service' : 'Add Service' }}
                </label>

                <!-- Form -->
                <div class="flex flex-col lg:flex-row pb-14 justify-between gap-4 w-full h-full">
                    <!-- Left column -->
                    <div class="flex flex-col gap-2 w-full h-full flex-grow">
                        <!-- Dropdown Admin Type -->
                        <div class="w-full h-auto flex flex-col gap-2">
                            <h1 class="text-sm">Role Type<span v-if="isSaved && currentItem['Role Type'].isChanged" class="ms-2 text-green-400">Saved</span></h1>
                            <span v-if="currentItem['Role Type'].value === ''" class="ms-2 text-red-600">Field Required</span>
                            <DropdownBoxContainer
                                size="w-full"
                                :options="adminTypeOptions"
                                v-model="currentItem['Role Type'].value"
                            />
                        </div>

                        <!-- Service Name -->
                         
                        <DialogBoxInput
                            label="Service Name"
                            v-model="currentItem['Service Name'].value"
                            id="serviceName"
                            placeholder="E.g. Tuition Pay"
                            :showError = "currentItem['Service Name'].value.trim() === ''"
                            :showSave="isSaved && currentItem['Service Name'].isChanged"
                        />
                        <div class="flex flex-col gap-2 w-full h-auto">
                            <label class="text-sm">Status<span v-if="isSaved && currentItem['Status'].isChanged" class="ms-2 text-green-400">Saved</span></label>
                            <ButtonSegmented v-model="currentItem.Status.value"/>
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

            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRef, watch } from 'vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
import DialogBoxInput from './subcomponents/DialogBoxInput.vue';
import ButtonSegmented from '../service/subcomponents/ButtonSegmented.vue'
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
    if(!isRequiredValuesNotEmpty()) return
    const service = {
        adminType: currentItem['Role Type'].value,
        name: currentItem['Service Name'].value.trim(),
        status: currentItem.Status.value
    }
    emit('add', service, () => {
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

const adminTypeOptions = [
    'Cashier',
    'Registrar',
    'Admission'
];

const item = toRef(props.item)
const isSaved = ref(true)

const currentItem = reactive({
    'Role Type': {value: adminTypeOptions[0], isChanged: false, required: true},
    'Service Name': {value: '', isChanged: false, required: true},
    'Status': {value: 'Open', isChanged: false, required: true }
})


onMounted(async ()=> {
    if(item.value && item.value.serviceID != undefined) {
        currentItem['Role Type'].value = adminTypeOptions.find(adminType => adminType == item.value['Role Type'])
        currentItem['Service Name'].value = item.value['Service Name']
        currentItem['Status'].value = item.value['Status']
    }
})

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
