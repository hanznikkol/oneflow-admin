<template>
    <div class="relative flex bg-[#94D1F1] min-h-screen w-full font-inter overflow-hidden">

        <!-- Logo -->
        <div class=" absolute top-4 left-4 h-10 z-50">
            <img class="w-full h-full object-cover" src="/src/assets/logo/ONEFlowLogoText.png"/>
        </div>
        
        <!-- Body -->
        <div class="w-full md:w-[50%] min-h-full flex px-16 md:pl-16 z-50">
            <!-- Auth Selection -->
            <div class="w-full md:w-auto h-full flex justify-center items-center">
                <div class="w-full h-auto flex flex-col gap-6">
                    <!-- Label -->
                    <div class="flex flex-col gap-2">
                        <h1 class="text-3xl font-bold">Welcome to 
                        <span class="text-custom-orange">ONE</span>
                        <span class="font-normal text-primary">Flow</span></h1>
                        <p class="font-medium text-xl">Login as</p>
                    </div>
                    
                    <!-- Buttons -->
                    <div class="w-full flex flex-col  justify-center items-center gap-4">
                       <ButtonContainer
                            text = "Admin"
                            sizeClass = "py-2 w-full"
                            textClass = "font-bold"
                            buttonRadius = "rounded-xl"
                       />

                       <p>or</p>

                       <ButtonContainer
                            text = "Personnel"
                            sizeClass = "py-2 w-full"
                            textClass = "text-white font-bold"
                            bgColorClass = "bg-primary hover:bg-[#004080]"
                            buttonRadius = "rounded-xl"
                       />
                    </div>
                </div>
            </div>

        </div>
        <!-- Mock Image -->
        <div class="w-full h-full fixed hidden md:block md:top-0 lg:left-20 md:translate-x-96 md:translate-y-24 lg:translate-y-3 overflow-hidden">
            <img class="object-cover overflow-hidden" src="/src/assets/mockimage/MockImage1.png"/>
        </div>
    </div>
</template>

<script setup>
import ButtonContainer from '../components/main/subcomponents/ButtonContainer.vue';
</script>