<template>
    <div class="fixed inset-0 flex justify-center items-center z-20">
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black opacity-50 transition-opacity duration-200" ></div>

        <!-- Confirm Dialog Box -->
        <div class="flex flex-col relative bg-white w-[50%] rounded-lg transition-transform duration-300 transform ">
            <!-- Exit Button -->
            <div class="absolute top-4 right-4 p-2">
                <button 
                    class="rounded-sm w-8 h-8 flex justify-center items-center outline outline-1 outline-gray hover:bg-light-gray shadow-sm duration-200 active:scale-110"
                    @click="emitClose"
                >
                    <IconCancel class="w-8 h-8"/>
                </button>
            </div>

            <!-- Main Content -->
            <div class="w-full gap-2 flex-1 p-8 flex flex-col">
                <!-- Text -->
                <h1 class="font-bold text-xl">{{title}}</h1>
                <p class="font-medium text-base text-label-gray">{{ content }}</p>
            </div>

            <!-- Buttons -->
            <div class="flex-1 flex gap-4 w-full bg-gray p-4">
                <DialogButtonContainer
                    text = "Cancel"
                    textClass = "text-base lg:text-lg font-bold"
                    sizeClass = "p-3 w-full"
                    bgColorClass = "bg-pure-white hover:bg-light-gray"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
                    @click="emitClose"
                />
                <DialogButtonContainer
                    v-if="mode === 'confirm'"
                    text = "Confirm"
                    textClass = "text-base lg:text-lg text-black font-bold"
                    sizeClass = "p-3 w-full"
                    bgColorClass = "bg-secondary hover:bg-[#E5D100]"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
                    @click="emitConfirm"
                />
                <DialogButtonContainer
                    v-else-if="mode === 'delete'"
                    text = "Delete"
                    textClass = "text-white lg:text-lg text-black font-bold"
                    sizeClass = "p-3 w-full"
                    bgColorClass = "bg-red-600 hover:bg-red-800"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
                    @click="emitDelete"
                />
                <DialogButtonContainer
                    v-else-if="mode === 'restore'"
                    text = "Restore"
                    textClass = "text-white lg:text-lg text-black font-bold"
                    sizeClass = "p-3 w-full"
                    bgColorClass = "bg-primary hover:bg-dark-primary"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
                    @click="emitRestore"
                />
                
            </div>
                
        </div>
    </div>
</template>

<script setup>
    //Button Container
    import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
    //Import Icon
    import IconCancel from '../icons/dialogbox_icons/IconCancel.vue';
    import { ref } from 'vue';

    //Transition
    const props = defineProps({
        mode: {
            type: String,
            default: 'confirm'
        },
        title: {
            type: String
        },
        content: {
            type: String
        }
    })
    const emit = defineEmits(['close', 'confirm', 'delete'])
    const emitClose = () => emit('close');
    const emitConfirm = () => emit('confirm')
    const emitDelete = () => emit('delete')
    const emitRestore = () => emit('restore')

</script>