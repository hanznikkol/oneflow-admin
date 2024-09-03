import {createWebHistory, createRouter} from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import Announcement from './views/Announcement.vue'
import Statistics from './views/Statistics.vue'
import Main from './views/Main.vue'

const routes = [
    {path: '/login', component: Login},
    {path: '/', component: Main, children: [
        {path: '', component: Dashboard },
        {path: '/announcement', component: Announcement },
        {path: '/statistics', component: Statistics },
    ]},
]

const  router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router