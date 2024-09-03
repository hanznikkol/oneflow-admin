<template>
    <!-- Side Box -->
    <div class="bg-primary w-full md:w-auto md:h-full rounded-xl px-2 py-3 md:py-4">
        <div class=" w-full h-full flex justify-around lg:justify-normal lg:flex-col items-center gap-8">

            <!-- Home -->
            <div class=" group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="/"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                        class="object-cover w-6 h-6 stroke-current text-pure-white group-hover:text-secondary"
                        :class = "{'text-secondary': isActive('/')}" 
                        :is="IconHome" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/')}" 
                    >Home</span>
                </RouterLink>
            </div>

            <!-- Queue Fill -->
            <div class="group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="announcement"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                    class="object-cover w-6 h-6 fill-current text-pure-white group-hover:text-secondary"
                    :class = "{'text-secondary': isActive('/announcement')}"  
                    :is="IconAnnouncement" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/announcement')}" 
                    >Annoucement</span>
                </RouterLink>
            </div>

            <!-- Statistics -->
            <div class="group hover:cursor-pointer w-auto h-auto">
                <RouterLink to="statistics"
                    class="flex flex-col items-center group-active:text-secondary"
                >
                    <component 
                    class="object-cover w-6 h-6 fill-current text-pure-white group-hover:text-secondary" 
                    :class = "{'text-secondary': isActive('/statistics')}"
                    :is="IconStatistics" />
                    <span class="text-[0.5rem] mt-1 text-pure-white group-hover:text-secondary items-center"
                    :class = "{'text-secondary': isActive('/statistics')}" 
                    >Statistics</span>
                </RouterLink>
            </div>

            <!-- Log Out -->
            <div class="flex flex-col lg:flex-1 lg:justify-end">
                <div class="group hover:cursor-pointer w-auto h-auto flex flex-col justify-center items-center">
                    <component class="object-cover w-6 h-6 stroke-current text-pure-white group-hover:text-custom-red" 
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
    import IconAnnouncement from '../icons/main_icons/sidenavigation/IconAnnouncement.vue';
    import IconStatistics from '../icons/main_icons/sidenavigation/IconStatistics.vue';
    import IconLogout from '../icons/main_icons/sidenavigation/IconLogout.vue';

    import { useRoute } from 'vue-router';
    //Active State based on route link
    const route = useRoute()
    
    const isActive = (path) => {
        return route.path === path
    }
</script>