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
    <div class="w-full flex-1 flex flex-col gap-2 border-4 border-main-gray rounded-xl p-4">
        <div class="w-full h-auto flex-col flex">
            <h1 class="text-2xl font-bold text-custom-orange">Feedback</h1>
            <div class="flex flex-row gap-2 h-auto">
                <p class="text-xl">for today</p>
                <p class="text-xl font-bold text-primary">({{feedbackItems.length}})</p>
            </div>
        </div>

        <!-- Swiper Js -->
        <div class="flex flex-row w-full h-full">
            <Swiper
            :slide-per-view="1"
            :space-between="10"
            :pagination="{ clickable: true }"
            :modules="[Pagination, Autoplay, Grid]"
            class="w-0 flex-grow h-full"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            >
                <template v-for="(slide, index) in feedbackSlides" :key="index">
                    <SwiperSlide>
                        <div class="h-full flex flex-col gap-1"> <!-- Flex container for spacing -->
                            <FeedbackItem 
                                v-for="(item, itemIndex) in slide" 
                                :key="itemIndex" 
                                :content="item.content" 
                                :reaction="item.reaction" 
                                :date="item.date" 
                            />
                        </div>
                    </SwiperSlide>
                </template>
            </Swiper>
        </div>
        
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import IconTicketDark from '../icons/dashboard_icons/IconTicketDark.vue';
import IconTicketLight from '../icons/dashboard_icons/IconTicketLight.vue';
import FeedbackItem from './subcomponents/FeedbackItem.vue';
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/grid'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, Grid } from 'swiper/modules';

const feedbackItems = ref([
    { content: "The online queue ticket is superb!! ...", reaction: "Very Good", date: "August 10, 2024" },
    { content: "Great service, very efficient!", reaction: "Excellent", date: "August 11, 2024" },
    { content: "Had a good experience, thanks!", reaction: "Good", date: "August 12, 2024" },
    { content: "The online queue ticket is superb!! ...", reaction: "Very Good", date: "August 10, 2024" },
    { content: "Great service, very efficient!", reaction: "Excellent", date: "August 11, 2024" },
    { content: "Had a good experience, thanks!", reaction: "Good", date: "August 12, 2024" },
    { content: "The online queue ticket is superb!! ...", reaction: "Very Good", date: "August 10, 2024" },
    { content: "Great service, very efficient!", reaction: "Excellent", date: "August 11, 2024" },
    { content: "Had a good experience, thanks!", reaction: "Good", date: "August 12, 2024" },
    // Add more items as needed
]);

const feedbackSlides = computed(() => {
    const slides = [];
    for (let i = 0; i < feedbackItems.value.length; i += 3) {
        slides.push(feedbackItems.value.slice(i, i + 3));
    }
    return slides;
});
</script>
