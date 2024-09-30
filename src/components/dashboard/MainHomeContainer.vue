<template>
    <!-- Summary Report Container -->
    <div class="flex flex-col flex-[3] gap-1 bg-pure-white border-4 border-main-gray rounded-xl p-2">
        <!-- Title -->
        <div class="w-full h-auto">
            <h1 class="text-2xl font-bold text-custom-orange">Summary Report</h1>
        </div>

        <!-- Bento Box Parent -->
        <div class="w-full h-full flex-1 flex flex-col gap-2">
            <!-- Top -->
            <div class="w-full h-full bg-main-gray rounded-lg flex-1 flex flex-col lg:flex-row justify-evenly gap-1 p-1">
                <!-- Total Ticket Volume -->
                <div class="relative overflow-hidden flex-1 flex flex-col w-full h-full bg-pure-white p-2 rounded-lg">
                    <p class="text-[.80rem] xl:text-sm font-semibold">Total Ticket Volume</p>
                    <div class="w-full h-full flex justify-end items-end z-20">
                        <h1 class="text-5xl lg:text-7xl font-bold">999</h1>
                    </div>
                    <component :is="IconTicketDark" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-16 -left-6 absolute" />
                </div>

                <!-- Total Volume Today -->
                <div class="relative overflow-hidden flex-1 flex flex-col w-full h-full bg-pure-white p-2 rounded-lg">
                    <p class="text-[.80rem] xl:text-sm font-semibold">Total Volume Today</p>
                    <div class="w-full h-full flex justify-end items-end z-20">
                        <h1 class="text-5xl lg:text-7xl font-bold">100</h1>
                    </div>
                    <component :is="IconTicketDark" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-16 -left-6 absolute"/>
                </div>

                <!-- Pending Ticket Today -->
                <div class="relative overflow-hidden flex-1 flex flex-col w-full h-full bg-main-gray p-2 rounded-lg">
                    <p class="text-[.80rem] xl:text-sm font-semibold">Pending Ticket Today</p>
                    <div class="w-full h-full flex justify-end items-end">
                        <h1 class="text-5xl lg:text-7xl font-bold z-20">19</h1>
                    </div>
                    <component :is="IconTicketLight" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-16 -left-6 absolute"/>
                </div>
            </div>

            <!-- Bottom -->
            <div class="w-full h-full flex flex-col lg:flex-row gap-2 flex-[3]">
                <!-- Left -->
                <div class="flex-1 flex flex-col gap-1 bg-main-gray p-1 rounded-lg">
                    <div class="flex-1 w-full h-full flex flex-col bg-pure-white p-2 rounded-lg">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Abandonment Rate</p>
                        <div class="w-full h-full flex justify-end items-end">
                            <h1 class="text-7xl font-bold">8%</h1>
                        </div>
                    </div>
                    <div class="flex-1 w-full h-full flex flex-col bg-main-gray p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Abandonment Count Today</p>
                        <div class="w-full h-full flex justify-end items-end">
                            <h1 class="text-7xl font-bold">8%</h1>
                        </div>
                    </div>
                </div>

                <!-- Right -->
                <div class="w-full h-full flex flex-col gap-2 flex-[3]">
                    <div class="flex-1 w-full h-full flex flex-col bg-pure-white border-4 border-main-gray rounded-lg p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Waiting Time</p>
                        <div class="w-full h-full flex justify-end items-end">
                            <h1 class="text-7xl font-bold">01:00</h1>
                        </div>
                    </div>
                    <div class="flex-1 w-full h-full flex flex-col bg-pure-white border-4 border-main-gray rounded-lg p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Serving Time</p>
                        <div class="w-full h-full flex justify-end items-end">
                            <h1 class="text-7xl font-bold">01:00</h1>
                        </div>
                    </div>
                    <div class="flex-1 w-full h-full flex flex-col bg-pure-white border-4 border-main-gray rounded-lg p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Resolution Time</p>
                        <div class="w-full h-full flex justify-end items-end">
                            <h1 class="text-7xl font-bold">01:00</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Feedback Container -->
    <div class="flex flex-[1] flex-col gap-2 bg-pure-white border-4 border-main-gray rounded-xl p-4">
        <div class="w-full h-auto flex-col flex">
            <h1 class="text-2xl font-bold text-custom-orange">Feedback</h1>
            <div class="flex flex-row gap-2 h-auto">
                <p class="text-xl">for today</p>
                <p class="text-xl font-bold text-primary">(3)</p>
            </div>
        </div>

        <!-- Swiper Js -->
        <div class="flex-1 h-full w-full bg-red-50">
            <!-- <swiper
                :space-between="10"
                :pagination="{ clickable: true }"
                :modules="modules"
                class="flex-col flex items-center bg-blue-100"
                :autoplay="{ delay: 2500, disableOnInteraction: false }"
            >
              <swiper-slide v-for="index in 3" :key="index">{{ index }}</swiper-slide>
            </swiper> -->
        </div>
    </div>
</template>

<script setup>
// import IconTicketDark from '../icons/dashboard_icons/IconTicketDark.vue';
// import IconTicketLight from '../icons/dashboard_icons/IconTicketLight.vue';
// import 'swiper/css'
// import 'swiper/css/pagination'
// import 'swiper/css/autoplay'
// import 'swiper/css/grid'
// import { Swiper } from 'swiper/vue';
// import { SwiperSlide } from 'swiper/vue';
// import { Pagination, Autoplay } from 'swiper/modules';

// const modules = [Pagination, Autoplay]
</script>
