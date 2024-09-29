import {createWebHistory, createRouter} from 'vue-router'

//Login
import Login from './views/Login.vue'
//Side Navigation
import Dashboard from './views/Dashboard.vue'
import Personnel from './views/Personnel.vue'
import Announcement from './views/Announcement.vue'
import Statistics from './views/Statistics.vue'
import Main from './views/Main.vue'
import Videos from './views/Videos.vue'
import Feedback from './views/Feedback.vue'
//Tab Layouts (Statistics)
import ServingTime from './components/statistics/tabviews/ServingTime.vue'
import CustomerJourney from './components/statistics/tabviews/CustomerJourney.vue'
import CounterPerformance from './components/statistics/tabviews/CounterPerformance.vue'
import GraphReport from './components/statistics/tabviews/GraphReport.vue'

const routes = [
    {path: '/admin/login', component: Login},
    {path: '/admin', component: Main, children: [
        {path: 'home', component: Dashboard },
        {path: 'personnel', component: Personnel },
        {path: 'announcement', component: Announcement },
        {path: 'statistics', component: Statistics, children: [
            {path: 'servingtime', component: ServingTime, 
                props: route => ({startDate: route.query.sd, endDate: route.query.ed})
            },
            {path: 'customerjourney', component: CustomerJourney, 
                props: route => ({startDate: route.query.sd, endDate: route.query.ed})
            },
            {path: 'counterperformance', component: CounterPerformance, 
                props: route => ({startDate: route.query.sd, endDate: route.query.ed})
            },
            {path: 'graphreport', component: GraphReport,
                props: route => ({ counter: route.query.c, type: route.query.t, startDate: route.query.sd, endDate: route.query.ed})
            },
        ]},
        {path: 'videos', component: Videos},
        {path: 'feedback', component: Feedback},
    ]},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router