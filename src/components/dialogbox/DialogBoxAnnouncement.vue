<template>
    <div class="fixed inset-0 flex justify-center items-center z-20">
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black opacity-50 transition-opacity duration-200" ></div>

        <!-- Confirm Dialog Box -->
        <div class="flex flex-col relative bg-pure-white w-[55%] h-auto rounded-lg">
            <!-- Exit Button -->
            <div class="absolute top-3 right-4 p-2">
                <button 
                    class="rounded-sm w-8 h-8 flex justify-center items-center outline outline-1 outline-gray hover:bg-light-gray shadow-sm duration-200 active:scale-110"
                    @click="emitClose"
                >
                    <IconCancel class="w-8 h-8"/>
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
                    />
                </div>

                <!-- Enable -->
                <div class="w-full h-auto flex flex-col gap-2">
                    <h1 class="text-sm">Enable</h1>
                    <ToggleSwitchContainer
                        v-model="toggleEnable"
                    />
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

const toggleEnable = ref(false)
const announcedToOptions = [
    'Cashier',
    'Registrar'
]

const selectedAnnouncedTo = ref(announcedToOptions[0])
</script>
