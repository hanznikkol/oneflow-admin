<template>
    <div class="fixed inset-0 flex justify-center items-center z-20">
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black opacity-50 transition-opacity duration-200" ></div>

        <!-- Dialog Box -->
        <div class="flex flex-col relative bg-pure-white w-[80%] lg:w-[55%] max-h-[90svh] lg:h-auto rounded-lg ">
          
            <!-- Main Content -->
            <div class="w-full gap-4 lg:flex-1 py-4 flex flex-col lg:justify-center px-4 overflow-y-auto">
                <label for="personnel" class=" font-bold text-base lg:text-xl">
                    {{ mode === 'edit' ? 'Edit Personnel' : 'Create Personnel'}}
                </label>
                
                <!-- Form -->
                <div class="flex flex-col lg:flex-row justify-between gap-4 w-full h-full">
                    <!-- Left column -->
                    <div class="flex flex-col gap-2 w-full h-full flex-grow">

                        <!-- Dropdown Admin Type -->
                        <div class="w-full h-auto flex flex-col gap-2">
                            <h1 class="text-sm">Admin Type</h1>
                            <DropdownBoxContainer
                                size= "w-full"
                                :options = "announcedToOptions"
                                v-model = "selectedAnnouncedTo"
                            />
                        </div>

                        <!-- Last Name -->
                        <DialogBoxInput 
                            label="Last Name"
                            v-model="lastName"
                            id="lastName"
                            placeholder="E.g. Legend"
                        />

                        <!-- Email -->
                        <DialogBoxInput 
                            label="Email"
                            type = "email"
                            v-model="email"
                            id="email"
                            placeholder="example@mail.com"
                        />
                    </div>

                    <!-- Right column -->
                    <div class="flex flex-col gap-2 w-full h-full flex-grow">
                        <!-- Role Name -->
                        <DialogBoxInput 
                            label="Role Name"
                            v-model="roleName"
                            id="roleName"
                            placeholder="Role Type"
                        />
                        <!-- First Name -->
                        <DialogBoxInput 
                            label="First Name"
                            v-model="firstName"
                            id="firstName"
                            placeholder="E.g. Randall"
                        />

                        <!-- Phone No -->
                        <DialogBoxInput 
                            label="Phone No"
                            type="tel"
                            v-model="phone"
                            id="phone"
                            placeholder="09*********"
                        />
                    </div>
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
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
import DialogBoxInput from './subcomponents/DialogBoxInput.vue';

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

const announcedToOptions = [
    'Cashier',
    'Registrar'
]

const selectedAnnouncedTo = ref(announcedToOptions[0])
const lastName = ref('');
const email = ref('');
const roleName = ref('');
const firstName = ref('');
const phone = ref('');
</script>
