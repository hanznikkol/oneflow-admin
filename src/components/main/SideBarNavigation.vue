<template>
    <!-- Side Box -->
    <div class="bg-primary w-full md:w-auto md:h-full rounded-xl px-2 py-3 md:py-4">
        <div class=" w-full h-full flex justify-around lg:justify-normal lg:flex-col items-center gap-6">

            <!-- Home -->
            <div class=" group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="/admin/home"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                        class="object-cover w-5 h-5 lg:w-6 lg:h-6 stroke-current text-pure-white group-hover:text-secondary"
                        :class = "{'text-secondary': isActive('/admin/home')}" 
                        :is="IconHome" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/admin/home')}" 
                    >Home</span>
                </RouterLink>
            </div>

            <!-- Personnel -->
            <div class="group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="/admin/personnel"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                    class="object-cover w-5 h-5 lg:w-6 lg:h-6 stroke-current text-pure-white group-hover:text-secondary"
                    :class = "{'text-secondary': isActive('/admin/personnel')}"  
                    :is="IconPersonnel" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/admin/personnel')}" 
                    >Personnel</span>
                </RouterLink>
            </div>

            <!-- Annoucement -->
            <div class="group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="/admin/announcement"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                    class="object-cover w-5 h-5 lg:w-6 lg:h-6 fill-current text-pure-white group-hover:text-secondary"
                    :class = "{'text-secondary': isActive('/admin/announcement')}"  
                    :is="IconAnnouncement" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/admin/announcement')}" 
                    >Announcement</span>
                </RouterLink>
            </div>

            <!-- Statistics -->
            <div class="group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="/admin/statistics"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                    class="object-cover w-5 h-5 lg:w-6 lg:h-6 fill-current text-pure-white group-hover:text-secondary" 
                    :class = "{'text-secondary': isActive('/admin/statistics')}"
                    :is="IconStatistics" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/admin/statistics')}" 
                    >Statistics</span>
                </RouterLink>
            </div>

            <!-- Videos -->
            <div class="group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="/admin/videos"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                    class="object-cover w-5 h-5 lg:w-6 lg:h-6 fill-current text-pure-white group-hover:text-secondary" 
                    :class = "{'text-secondary': isActive('/admin/videos')}"
                    :is="IconVideos" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/admin/videos')}" 
                    >Videos</span>
                </RouterLink>
            </div>

            <!-- Feedback -->
            <div class="group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="/admin/feedback"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                    class="object-cover w-5 h-5 lg:w-6 lg:h-6 fill-current text-pure-white group-hover:text-secondary" 
                    :class = "{'text-secondary': isActive('/admin/feedback')}"
                    :is="IconFeedback" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/admin/feedback')}" 
                    >Feedback</span>
                </RouterLink>
            </div>

            <!-- Log Out -->
            <div class="flex flex-col lg:flex-1 lg:justify-end">
                <div class="group hover:cursor-pointer w-auto h-auto flex flex-col justify-center items-center">
                    <component class="object-cover w-5 h-5 lg:w-6 lg:h-6 stroke-current text-pure-white group-hover:text-custom-red" 
                    :is="IconLogout" />

                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-custom-red items-center">Logout</span>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script setup>

//Icons
import IconHome from '../icons/main_icons/sidenavigation/IconHome.vue';
import IconPersonnel from '../icons/main_icons/sidenavigation/IconPersonnel.vue';
import IconAnnouncement from '../icons/main_icons/sidenavigation/IconAnnouncement.vue';
import IconStatistics from '../icons/main_icons/sidenavigation/IconStatistics.vue';
import IconLogout from '../icons/main_icons/sidenavigation/IconLogout.vue';
import IconVideos from '../icons/main_icons/sidenavigation/IconVideos.vue';
import IconFeedback from '../icons/main_icons/sidenavigation/IconFeedback.vue';

import { useRoute } from 'vue-router';

//Active State based on route link
const route = useRoute()

const isActive = (path) => {
    return route.path === path || route.path.startsWith(path + '/');
}
</script>