<template>
    <!-- Left Containter -->
    <div class="flex-[2] hidden lg:block">
            <div class="absolute top-0 left-0 translate-x-6 translate-y-6 w-52 h-52">
                <img src="/src/assets/logo/ONEFlowLogo2.png"/>
            </div>
            <div class="w-full h-full">

            </div>
        </div>

        <!-- Login Container -->
        <div class="flex flex-col justify-center items-center gap-12 flex-1 bg-pure-white">
            <!-- Mobile View -->
            <div class="block lg:hidden">
                <div class="flex justify-center w-20 h-20">
                    <img src="/src/assets/logo/ONEFlowMainLogo.png"/>
                </div>
            </div>

            <!-- Input Container -->
            <div class="h-auto w-full gap-6 p-6 flex flex-col justify-center">
                <!-- Login Text -->
                <div>
                    <h1 class="text-3xl font-bold">Login</h1>
                    <p class="text-base text-label-gray">Enter your credentials to get started!</p>
                </div>
                
                <!-- Form -->
                <div class="flex flex-col gap-4">
                    <!-- Email -->
                    <TextBoxContainer
                        placeholder = "Email"
                        type = 'email'
                        :icon = 'IconEmail'
                    />
                    <!-- Password -->
                    <TextBoxContainer
                        placeholder = "Password"
                        type = 'password'
                        :icon = "IconPassword"
                    />
                    <!-- Remember Me (Checkbox) -->
                    <RememberMe/>
                </div>

                <ButtonContainer
                    text = "Login"
                    textClass = "text-lg text-black font-bold"
                    sizeClass = "w-full p-4"
                />
            </div>
        </div>
</template>

<script setup>
    //Component
    import RememberMe from './subcomponents/RememberMe.vue';
    import TextBoxContainer from './subcomponents/TextBoxContainer.vue';
    import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';

    //Icons
    import IconEmail from '../icons/login_icons/IconEmail.vue';
    import IconPassword from '../icons/login_icons/IconPassword.vue';

</script>