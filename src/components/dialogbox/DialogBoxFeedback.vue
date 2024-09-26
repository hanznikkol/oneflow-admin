<template>
    <div class="fixed inset-0 flex justify-center items-center z-20">
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black opacity-50 transition-opacity duration-200" ></div>

        <!-- Dialog Box -->
        <div class="flex flex-col relative bg-pure-white w-[55%] h-auto rounded-lg overflow-y-auto">
            <!-- Exit Button -->
            <div class="absolute top-2 right-2 lg:right-4  p-2 z-20">
                <button 
                    class="rounded-sm w-6 h-6 lg:w-8 lg:h-8 flex justify-center items-center outline outline-1 outline-gray hover:bg-light-gray shadow-sm duration-200 active:scale-110"
                    @click="emitClose"
                >
                    <IconCancel class="w-6 h-6 lg:w-8 lg:h-8"/>
                </button>
            </div>

            <!-- Main Content -->
            <div class="w-full gap-4 flex-1 flex flex-row justify-center p-4 overflow-hidden">
                <div class="w-full lg:w-[50%] h-full flex flex-col gap-4 z-40">
                    <h3 class=" font-semibold text-base lg:text-xl text-custom-orange">
                        Customers Feedback
                    </h3>

                    <h1 class="text-3xl whitespace-pre-line">
                        Here is what the <span class="font-bold">customers</span> have to say!
                    </h1>

                    <p class="text-sm overflow-y-auto max-h-48 w-full lg:max-h-none whitespace-pre-line">
                        The online queue ticket is superb!! ang laking tulong nya especially kapag may inaabyad ka pa na iba and ayaw mo mawala sa pila, just a glance sa phone mo makikita mo na kung anong queue number na ung currently being served!
                    </p>

                    <!-- Reaction -->
                    <div class="w-auto lg:w-64">
                        <ReactionContainer/>
                    </div>
                    
                    <!-- Date -->
                    <p class="font-bold text-sm">
                        August 5, 2002
                    </p>
                </div>

                <!-- Quotation -->
                <div class="w-full h-full relative z-10">
                    <component class="w-64 h-64 lg:w-80 lg:h-80 absolute -top-8 -right-4 overflow-hidden" :is="IconQuotation"/>
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
import IconQuotation from '../icons/dialogbox_icons/IconQuotation.vue';
import IconCancel from '../icons/dialogbox_icons/IconCancel.vue';
import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
import ReactionContainer from '../feedback/subcomponents/ReactionContainer.vue';

const emit = defineEmits(['close'])
const emitClose = () => emit('close');
</script>