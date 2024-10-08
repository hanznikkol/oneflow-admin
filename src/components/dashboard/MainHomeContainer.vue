<template>
    <!-- Summary Report Container -->
    <div class="flex flex-col flex-[3] w-full h-full gap-1 bg-pure-white border-4 border-main-gray rounded-xl p-2">
        <!-- Title -->
        <div class="w-full h-auto">
            <h1 class="text-2xl font-bold text-custom-orange">Summary Report</h1>
        </div>

        <!-- Bento -->
        <div class="w-full h-full flex-1 flex flex-col gap-2">
            <!-- Top -->
            <div class="w-full h-full bg-main-gray rounded-lg flex-1 flex flex-col lg:flex-row justify-evenly gap-1 p-1">
                <!-- Total Ticket Volume -->
                <div class="relative overflow-hidden flex-1 flex flex-col w-full h-full bg-pure-white p-2 rounded-lg">
                    <p class="text-[.80rem] xl:text-sm font-semibold">Total Ticket Volume</p>
                    <div class="w-full h-full flex flex-col justify-end items-end z-20">
                        <Stonks :isImproved="report.totalTicketVolume ? report.totalTicketVolume.change > 0 : false" :value="report.totalTicketVolume ? report.totalTicketVolume.change : ''" />
                        <h1 class="text-4xl lg:text-7xl font-bold">{{ report.totalTicketVolume ? report.totalTicketVolume.value : 'N/A' }}</h1>
                    </div>
                    <component :is="IconTicketDark" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-16 -left-6 absolute" />
                </div>

                <!-- Total Volume Today -->
                <div class="relative overflow-hidden flex-1 flex flex-col w-full h-full bg-pure-white p-2 rounded-lg">
                    <p class="text-[.80rem] xl:text-sm font-semibold">Ticket Volume Today</p>
                    <div class="w-full h-full flex flex-col justify-end items-end z-20">
                        <Stonks :isImproved="report.ticketVolumeToday ? report.ticketVolumeToday.change > 0 : false" :value="report.ticketVolumeToday ? report.ticketVolumeToday.change : ''" />
                        <h1 class="text-4xl lg:text-7xl font-bold">{{ report.ticketVolumeToday ? report.ticketVolumeToday.value : 'N/A' }}</h1>
                    </div>
                    <component :is="IconTicketDark" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-16 -left-6 absolute"/>
                </div>

                <!-- Pending Ticket Today -->
                <div class="relative overflow-hidden flex-1 flex flex-col w-full h-full bg-main-gray p-2 rounded-lg">
                    <p class="text-[.80rem] xl:text-sm font-semibold">Pending Ticket Today</p>
                    <div class="w-full h-full flex justify-end items-end">
                        <h1 class="text-4xl lg:text-7xl font-bold z-20">{{report.pendingTicketToday ? report.pendingTicketToday.value : 'N/A' }}</h1>
                    </div>
                    <component :is="IconTicketLight" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-16 -left-6 absolute"/>
                </div>
            </div>

            <!-- Bottom -->
            <div class="h-full w-full flex-[3] flex flex-col lg:flex-row gap-2">
                <!-- Left -->
                <div class="h-full w-full flex-1">
                    <div class="flex-1 flex flex-col h-full gap-1 bg-main-gray p-1 rounded-lg">
                        <!-- Abandonment Rate -->
                        <div class="flex-1 w-full h-full flex flex-col bg-pure-white p-2 rounded-lg">
                            <p class="text-[.80rem] xl:text-sm font-semibold">Total Abandonment Rate</p>
                            <div class="w-full h-full flex flex-col justify-end items-end">
                                <Stonks :isImproved="report.totalAbandonmentRate ? report.totalAbandonmentRate.change < 0 : false" :value="report.totalAbandonmentRate ? report.totalAbandonmentRate.change : ''" />
                                <h1 class="text-4xl lg:text-7xl font-bold">{{ report.totalAbandonmentRate ? report.totalAbandonmentRate.value : 'N/A' }}%</h1>
                            </div>
                        </div>
                        <!-- Abandonment Count Today -->
                        <div class="flex-1 w-full h-full flex flex-col bg-main-gray p-2">
                            <p class="text-[.80rem] xl:text-sm font-semibold">Abandonment Count Today</p>
                            <div class="w-full h-full flex flex-col justify-end items-end">
                                <Stonks :isImproved="report.abandonmentCountToday ? report.abandonmentCountToday.change < 0 : false" :value="report.abandonmentCountToday ? report.abandonmentCountToday.change : ''" />
                                <h1 class="text-4xl lg:text-7xl font-bold">{{ report.abandonmentCountToday ? report.abandonmentCountToday.value : 'N/A' }}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Right -->
                <div class="h-full w-full flex-[3] flex flex-col gap-1 lg:gap-2">
                    <!-- Total Avg. Waiting Time -->
                    <div class="relative overflow-hidden flex-grow w-full h-full lg:h-0 flex flex-col bg-pure-white border-4 border-main-gray rounded-lg p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Waiting Time</p>
                        <div class="w-full h-full flex justify-end items-end">
                            <Stonks :isImproved="report.totalAvgWaitingTime ? report.totalAvgWaitingTime.change < 0 : false" :value="report.totalAvgWaitingTime ? report.totalAvgWaitingTime.change : ''" />
                            <h1 class="text-4xl lg:text-7xl font-bold">{{ report.totalAvgWaitingTime ? formatTime(report.totalAvgWaitingTime.value) : 'N/A' }}</h1>
                        </div>
                        <component :is="IconTimer" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-20 absolute"/>
                    </div>
                    <!-- Total Avg. Waiting Time -->
                    <div class="relative overflow-hidden flex-grow w-full h-full lg:h-0 flex flex-col bg-pure-white border-4 border-main-gray rounded-lg p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Serving Time</p>
                        <div class="w-full h-full flex justify-end items-end">
                            <Stonks :isImproved="report.totalAvgServingTime ? report.totalAvgServingTime.change < 0 : false" :value="report.totalAvgServingTime ? report.totalAvgServingTime.change : ''" />
                            <h1 class="text-4xl lg:text-7xl font-bold">{{ report.totalAvgServingTime ? formatTime(report.totalAvgServingTime.value) : 'N/A' }}</h1>
                        </div>
                        <component :is="IconTimer" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-20 absolute"/>
                    </div>
                    <!-- Total Avg. Waiting Time -->
                    <div class="relative overflow-hidden flex-grow w-full h-full lg:h-0 flex flex-col bg-pure-white border-4 border-main-gray rounded-lg p-2">
                        <p class="text-[.80rem] xl:text-sm font-semibold">Total Avg. Resolution Time</p>
                        <div class="w-full h-full flex justify-end items-end">
                            <Stonks :isImproved="report.totalAvgResolutionTime ? report.totalAvgResolutionTime.change < 0 : false" :value="report.totalAvgResolutionTime ? report.totalAvgResolutionTime.change : ''" />                          
                            <h1 class="text-4xl lg:text-7xl font-bold">{{ report.totalAvgResolutionTime ? formatTime(report.totalAvgResolutionTime.value) : 'N/A' }}</h1>
                        </div>
                        <component :is="IconTimer" class="w-32 h-32 lg:w-40 lg:h-40 -bottom-20 absolute"/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Feedback Container -->
    <div class="w-full flex-1 h-full flex flex-col gap-2 border-4 border-main-gray rounded-xl p-4">
        <div class="w-full h-auto flex flex-row">
            <!-- Label -->
            <div class="w-full flex-col flex">
                <h1 class="text-2xl font-bold text-custom-orange">Feedback</h1>
                <div class="flex flex-row gap-2 h-auto">
                    <p class="text-xl">for today</p>
                    <p class="text-xl font-bold text-primary">({{feedbackItems.length}})</p>
                </div>
            </div>
            <!-- View ALl -->
            <div class="w-full p-1">
                <p class="w-full hover:text-custom-orange cursor-pointer text-sm text-primary text-end "
                    @click="viewAllFeedbacks"
                >View All</p>
            </div>
        </div>

        

        <div class="flex flex-row w-full h-full lg:h-0 flex-grow">
            <Swiper
            :slide-per-view="1"
            :space-between="10"
            :pagination="{ clickable: true }"
            :modules="[Pagination, Autoplay, Grid]"
            class="w-0 flex flex-grow h-full"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            >
                <template v-for="(slide, index) in feedbackSlides" :key="index">
                    <SwiperSlide>
                        <div class="h-full flex flex-col gap-1">
                            <FeedbackItem 
                                v-for="(item, itemIndex) in slide" 
                                :key="itemIndex" 
                                :feedback="item" 
                                @click="showFeedbackDialog(item)"
                            />
                        </div>
                    </SwiperSlide>
                </template>
            </Swiper>
        </div>
    </div>

    <!-- Show Dialog Box -->
     <DialogBoxFeedback 
        :feedback="selectedFeedback"
        v-if="isFeedbackVisible"  
        @close="hideFeedbackDialog"
    />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//Icons
import IconTicketDark from '../icons/dashboard_icons/IconTicketDark.vue';
import IconTicketLight from '../icons/dashboard_icons/IconTicketLight.vue';
import IconTimer from '../icons/dashboard_icons/IconTimer.vue';
import IconUptrend from '../icons/dashboard_icons/IconUptrend.vue';
import Stonks from './subcomponents/Stonks.vue';
import DialogBoxFeedback from '../dialogbox/DialogBoxFeedback.vue';
//Component 
import FeedbackItem from './subcomponents/FeedbackItem.vue';
//Swiper JS
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/grid'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, Grid } from 'swiper/modules';
import moment from 'moment';

const feedbackItems = ref([]);

const router = useRouter()
const viewAllFeedbacks = () => {
    router.push({ path: 'feedback' })
}

const report = ref({})
const feedbackSlides = computed(() => {
    const slides = [];
    for (let i = 0; i < feedbackItems.value.length; i += 3) {
        slides.push(feedbackItems.value.slice(i, i + 3));
    }
    return slides;
});

const isFeedbackVisible = ref(false)
const selectedFeedback = ref({})

const showFeedbackDialog = (item) => {
    selectedFeedback.value = item // Optional: Use the item
    isFeedbackVisible.value = true;  // Make dialog visible
};

const hideFeedbackDialog = () => {
    isFeedbackVisible.value = false;
    selectedFeedback.value = {}
}

const getFeedbacks = async(date) => {
    try{
        const request = `/api/feedbacks?sd=${date}`
        const response = await fetch(request, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }, 
        })
        const data = await response.json()
        if(!response.ok) return alert(data.error)
        return data.feedbacks
    }
    catch(err){
        console.error(err)
    }
}

onMounted(async ()=> {
    report.value = await getStatistics()
    feedbackItems.value = await getFeedbacks(moment().format('YYYY-MM-DD'))
})

const getStatistics = async() => {
    try{
        const token = localStorage.getItem('jwt')
        let request =  `/api/statistics?type=total-summary-report`
        const response = await fetch(request, { 
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        if(!response.ok) return alert(`An error occured: ${data.error}`)
        return data.statistics
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

const formatTime = (time) => {
    const duration = moment.duration(time); // Replace with your time string
    let formattedTime;
    if (duration.asHours() >= 1) {
        // If duration is 1 hour or more, use "hh:mm:ss"
        formattedTime = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
    } else {
        // Otherwise, use "mm:ss"
        formattedTime = moment.utc(duration.asMilliseconds()).format("mm:ss");
    }
    return formattedTime
}


</script>

<style>
/* Customize pagination bullet colors */
.swiper-pagination-bullet {
    background-color: #d1d5db; /* Tailwind gray-300 color */
    opacity: 1;
}

.swiper-pagination-bullet-active {
    background-color: #FEB019; /* Tailwind teal-700 color */
}
</style>