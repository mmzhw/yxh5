import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
// import imgSrc from '../util/imgSrc';

Vue.use(Vuex);

export function createStore() {
    return new Vuex.Store({
        state: {
            channels: [],
            videoInfo: {
                extMap: '',
                name: '',
            },
            channelIdArr: [],
            activeType: null,
            itemsPerPage: 20,
            items: {/* [id: number]: Item */ },
            dynamicsList: [],
            myViewList: [],
            userInfoData: {}, // 个人主页的用户信息
            myViewListPaper: { limit: 30, offset: 1, loading: false, lastPage: false },
            dynamicsListPaper: { limit: 30, offset: 1, loading: false, lastPage: false }
        },
        actions,
        mutations,
        getters
    });
}
