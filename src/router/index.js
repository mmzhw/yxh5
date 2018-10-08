import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// route-level code splitting
const Index = () => import('../views/Index.vue');
const Play = () => import('../views/Play.vue');
const Search = () => import('../views/Search.vue');
const NotFound = () => import('../views/NotFound.vue');
const Live = () => import('../views/live.vue');
const Activity = () => import('../views/activity.vue');
const Download = () => import('../views/download.vue');
const ShortVideo = () => import('../views/shortVideo.vue');
const BrowserOpen = () => import('../views/browserOpen.vue');
const PersonPage = () => import('../views/personPage/personPage.vue');

export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '*', component: NotFound },
            { path: '/', redirect: '/index/' },
            { path: '/index/:channelId?', name: 'Index', component: Index },
            { path: '/play/:videoBaseId', name: 'Play', component: Play },
            { path: '/search', name: 'Search', component: Search },
            { path: '/notFound', name: 'notFound', component: NotFound },
            { path: '/live/:roomId', name: 'Live', component: Live },
            { path: '/activity/:activityId', name: 'activity', component: Activity },
            { path: '/download', name: 'download', component: Download },
            { path: '/shortVideo/:videoId', name: 'shortVideo', component: ShortVideo },
            { path: '/browserOpen', name: 'browserOpen', component: BrowserOpen },
            { path: '/personPage', name: 'personPage', component: PersonPage },
        ]
    });
}
