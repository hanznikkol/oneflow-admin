import {createWebHistory, createRouter} from 'vue-router'

//Login
import Login from './views/Login.vue'
//Side Navigation
import Dashboard from './views/Dashboard.vue'
import Announcement from './views/Announcement.vue'
import Statistics from './views/Statistics.vue'
import Main from './views/Main.vue'
import Videos from './views/Videos.vue'
//Tab Layouts (Statistics)
import ServingTime from './components/statistics/tabviews/ServingTime.vue'
import CustomerJourney from './components/statistics/tabviews/CustomerJourney.vue'
import CounterPerformance from './components/statistics/tabviews/CounterPerformance.vue'
import GraphReport from './components/statistics/tabviews/GraphReport.vue'

const routes = [
    {path: '/login', component: Login},
    {path: '/', component: Main, children: [
        {path: '', component: Dashboard },
        {path: 'announcement', component: Announcement },
        {path: 'statistics', component: Statistics, children: [
            {path: 'servingtime', component: ServingTime},
            {path: 'customerjourney', component: CustomerJourney},
            {path: 'counterperformance', component: CounterPerformance},
            {path: 'graphreport', component: GraphReport},
        ]},
        {path: 'videos', component: Videos},
    ]},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router