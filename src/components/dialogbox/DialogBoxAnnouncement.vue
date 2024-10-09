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
                        v-model = "selectedAnnouncedTo"
                    />
                </div>

                
                <!-- Text Area -->
                <div class="w-full h-full flex-1">
                    <textarea 
                        id = "announcement"
                        rows = "6"
                        class="text-sm w-full h-full flex-1 bg-light-gray p-4 rounded-lg placeholder:text-black placeholder:italic resize-none"
                        placeholder="Type your announcement here..."
                        v-model="announcement"
                    />
                </div>

                <!-- Enable -->
                <div class="w-full h-auto flex flex-col gap-2">
                    <h1 class="text-sm">Disable</h1>
                    <ButtonSegmented v-model="selectedDisableOption" :items="disableOptionItems"></ButtonSegmented>
                </div>
                 
                <div class="w-[50%] h-auto flex flex-col gap-2">
                    <VueDatePicker 
                        v-if="selectedDisableOption === 'Scheduled'"
                        v-model = "selectedDuration"
                        placeholder = "Select time"
                        format = "MMM. d yyyy HH:mm"
                        :disabled-dates="disabledDates"
                        :clearable = "true"
                        :enable-time-picker="true"
                    />
                    <template v-else-if="selectedDisableOption === 'Manual'">
                        <h1 class="text-sm">Status</h1>
                        <ButtonSegmented v-model="selectedStatusOption" :items="statusOptionItems"></ButtonSegmented>
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
                    :text ="mode === 'edit' ? 'Save' : 'Create'"
                    textClass = "text-base text-black font-bold"
                    sizeClass = "p-2 w-full"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
                />
            </div>
                
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ToggleSwitchContainer from '../main/subcomponents/ToggleSwitchContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
import IconCancel from '../icons/dialogbox_icons/IconCancel.vue';
import ButtonSegmented from '../announcement/subcomponents/ButtonSegmented.vue';
import VueDatePicker from '@vuepic/vue-datepicker';

const selectedDisableOption = ref('Manual')
const disableOptionItems = ref(['Manual', 'Scheduled'])
const selectedStatusOption = ref('Enabled')
const statusOptionItems = ref(['Enabled', 'Disabled'])

const selectedDuration = ref('')
const announcement = ref('')
//Props
const props = defineProps({
    showDialog: {
        type: Boolean
    },
    mode: {
       type: String,
       required: true
    }
})

const emit = defineEmits(['close'])
const emitClose = () => emit('close');

const disabledDates = (date) => {
    const today = new Date();
    // Compare only date parts (ignore time)
    today.setHours(0, 0, 0, 0); 
    return date < today; // disables dates before today
}

const announcedToOptions = [
    'Queue Monitor',
    'All Counters',
    'Cashier',
    'Registrar',
    'Admission',
]

const selectedAnnouncedTo = ref(announcedToOptions[0])
</script>
