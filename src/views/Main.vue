<template>
    <div class="min-h-svh md:min-h-screen w-full flex flex-col p-2">
        <!-- Header -->
        <Header></Header>

        <!-- SideNav and Main Container -->
        <div class="gap-4 w-full flex-1 flex flex-col lg:flex-row">
            <div>
                <SideBarNavigation></SideBarNavigation>
            </div>

            <div class="w-full flex-1">
                <!-- Uncomment to Change View in Main Container -->
                <!-- <Dashboard></Dashboard> -->
                <!-- <QueueControl></QueueControl> -->
                <!-- <Statistics></Statistics> -->
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import Header from '../components/main/Header.vue';
import SideBarNavigation from '../components/main/SideBarNavigation.vue';

import { RouterView, useRouter } from 'vue-router'
import { useRoute } from 'vue-router';
import { setAuth, state } from '../../socket';

const route = useRoute()
const router = useRouter()

const promptLogin = () => {
  localStorage.removeItem("jwt")
  router.push('/admin/login')
}


onMounted( async () => {
    if(route.path == '/admin' || route.path == '/admin/')
        router.replace('/admin/home')
    state.adminInfo = await fetchAdminInfo()
    setAuth(state.adminInfo)
})

const fetchAdminInfo = async () => {
  const token = localStorage.getItem('jwt')
  if(!token) return router.push('/admin/login')
  const response = await fetch(`/api/admin-info`, { 
    method: 'GET', 
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  if(!response.ok) {
    alert(`An error occured: ${data.error}`)
    if(response.status == 403 || response.status == 401) return promptLogin()
  }
  return data.adminInfo
}

</script>
    
