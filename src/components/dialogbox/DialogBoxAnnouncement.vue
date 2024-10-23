<template>
    <div class="fixed inset-0 flex justify-center items-center z-20">
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black opacity-50 transition-opacity duration-200" ></div>

        <!-- Dialog Box -->
        <div class="flex flex-col relative bg-pure-white w-[55%] h-auto rounded-lg">
            <!-- Exit Button -->
            <div class="absolute top-3 right-4 p-2">
                <button 
                    class="rounded-sm w-6 h-6 lg:w-8 lg:h-8 flex justify-center items-center outline outline-1 outline-gray hover:bg-light-gray shadow-sm duration-200 active:scale-110"
                    @click="emitClose"
                >
                    <IconCancel class="w-6 h-6 lg:w-8 lg:h-8"/>
                </button>
            </div>

            <!-- Main Content -->
            <div class="w-full gap-4 flex-1 py-4 flex flex-col justify-center px-4">
                <label for="announcement" class=" font-bold text-base lg:text-xl">
                    {{ mode === 'edit' ? 'Edit Announcement' : 'Create Announcement'}}
                </label>
                
                <!-- Dropdown Admission -->
                <div class="w-full h-auto flex flex-col gap-2">
                    <h1 class="text-sm">Announced to</h1>
                    <DropdownBoxContainer
                        size= "w-56"
                        :options = "announcedToOptions"
                        v-model = "currentItem['Announced To'].value"
                    />
                </div>

                
                <!-- Text Area -->
                <div class="w-full h-full flex-1">
                    <label for="announcement" class="text-sm">
                        <span v-if="isSaved && currentItem['Message'].isChanged" class="ms-2 text-green-400">Saved</span>
                        <span v-if="currentItem['Message'].value.trim() === ''" class="ms-2 text-red-600">Field Required</span>
                    </label>
                    <textarea 
                        id = "announcement"
                        rows = "6"
                        class="text-sm w-full h-full flex-1 bg-light-gray p-4 rounded-lg placeholder:text-black placeholder:italic resize-none"
                        placeholder="Type your announcement here..."
                        v-model="currentItem['Message'].value"
                    />
                </div>

                <!-- Enable -->
                <div class="w-full h-auto flex flex-col gap-2">
                    <h1 class="text-sm">Disable</h1>
                    <ButtonSegmented v-model="selectedDisableOption" :items="disableOptionItems"></ButtonSegmented>
                </div>
                 
                <div class="w-[50%] h-auto flex flex-col gap-2">
                    <template v-if="selectedDisableOption === 'Scheduled'">
                        <label for="schedule" class="text-sm">
                            <span v-if="isSaved && currentItem['Disable At'].isChanged" class="text-green-400">Saved</span>
                            <span v-if="currentItem['Disable At'].value == null" class="text-red-600">Field Required</span>
                        </label>
                        <VueDatePicker 
                            v-model = "selectedDate"
                            placeholder = "Select time"
                            format = "MMM. d yyyy hh:mm a"
                            :disabled-dates="disabledDates"
                            :clearable = "true"
                            :enable-time-picker="true"
                        />
                    </template>

                    <template v-else-if="selectedDisableOption === 'Manual'">
                        <label for="status" class="text-sm">
                            Status
                            <span v-if="isSaved && currentItem['Status'].isChanged" class="ms-2 text-green-400">Saved</span>
                            <span v-if="currentItem['Status'].value === ''" class="ms-2 text-red-600">Field Required</span>
                        </label>
                        <ButtonSegmented v-model="currentItem['Status'].value" :items="statusOptionItems"></ButtonSegmented>
                    </template>
                </div>
            </div>
            
            <!-- Buttons -->
            <div class="flex-1 flex gap-4 w-full px-6 h-auto py-4 bg-gray">
                <DialogButtonContainer
                    text = "Cancel"
                    textClass = "text-base font-bold"
                    sizeClass = "p-2 w-full"
                    bgColorClass = "bg-pure-white hover:bg-light-gray"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
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
import { computed, onMounted, reactive, ref, toRef, watch } from 'vue';
import ToggleSwitchContainer from '../main/subcomponents/ToggleSwitchContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
import IconCancel from '../icons/dialogbox_icons/IconCancel.vue';
import ButtonSegmented from '../announcement/subcomponents/ButtonSegmented.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import moment from 'moment';

const selectedDisableOption = ref('Manual')
const disableOptionItems = ref(['Manual', 'Scheduled'])
const statusOptionItems = ref(['Enabled', 'Disabled'])
const selectedDate = ref('')

const isSaved = ref(false)

//Props
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
})

const emit = defineEmits(['close', 'delete', 'update', 'add']);
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
    const announcement = getAnnouncementInfo()
    emit('update', announcement, () => {
        // success callback
        isSaved.value = true
        Object.keys(valuesToUpdate).forEach(k=> {
            item.value[k] = valuesToUpdate[k]
        })
    })
}

const emitAdd = () => {
    if(!isRequiredValuesNotEmpty()) return
    const announcement = getAnnouncementInfo()
    emit('add', announcement, () => {
        emitClose()
    })
}

const getAnnouncementInfo = () => {
    const announcement = {
        announcedTo: currentItem['Announced To'].value,
        message: currentItem['Message'].value.trim(),
        status: currentItem.Status.value,
        duration: currentItem['Disable At'].value || ''
    }
    return announcement
}

const isRequiredValuesNotEmpty = () => {
    // check if any required fields have empty values
    const emptyRequiredValues = Object.keys(currentItem).filter((k)=>
        currentItem[k].required && currentItem[k].value.trim() === ''
    )

    if(emptyRequiredValues.length > 0) return false
    return true
}

const emitClose = () => emit('close');

const disabledDates = (date) => {
    const now = new Date();
      
    // Disable dates before today
    if (date < now.setHours(0, 0, 0, 0)) {
        return true;
    }

    // If selected date is today, disable times earlier than the current time
    if (date.toDateString() === now.toDateString()) {
        return date.getTime() < now.getTime();
    }

    return false; // Allow future dates and times
}

const formatDate = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD HH:mm')
    return formattedDate
}

const announcedToOptions = ref([
    'Queue Monitor',
    'All Counters',
    'Cashier',
    'Registrar',
    'Admission',
])

const isDurationRequired = computed(() => selectedDisableOption.value == 'Scheduled' ? true : false)


const currentItem = reactive({
    'Announced To': {
        value: announcedToOptions.value[0], 
        isChanged: false,
        required: true,
    },
    'Message': {
        value: '', 
        isChanged: false,
        required: true,
    },
    'Status': {
        value: statusOptionItems.value[0], 
        isChanged: false,
        required: false,
    }, 
    'Disable At': {
        value: null, 
        isChanged: false,
        required: isDurationRequired.value,
    }
})

const item = ref(props.item)

onMounted(() => {
    // if in edit mode
    if(item.value && item.value.announcementID != undefined) {
        currentItem['Announced To'].value = announcedToOptions.value.find(options => options == item.value['Announced To'])
        currentItem['Message'].value = item.value?.['Message']
        currentItem['Status'].value = item.value?.['Status']
    }
})

watch(() => isDurationRequired.value, (bool) => {
    currentItem['Disable At'].required = bool
})

watch(() => selectedDisableOption.value, (selectedDisable) => {
    if(selectedDisable === 'Manual'){
        selectedDate.value = null
    }
    else(selectedDisable === 'Scheduled')
        currentItem['Status'].value = 'Enabled'
})

watch(() => selectedDate.value, (date) => {
    if(date) 
        currentItem['Disable At'].value = formatDate(date)
    else currentItem['Disable At'].value = null
})
</script>
