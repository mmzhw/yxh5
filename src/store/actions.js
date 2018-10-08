import request from '../util/request';
import { fetchUser, fetchMyViewList, fetchDynamicsList } from '../util/serverUrl';
import axios from 'axios';

export default {

    FETCH_CHANNEL: ({ commit, dispatch, state }, { id }) => {
        return axios.post('/m_web/ableChannel', {})
            .then(res => {
                commit('SET_CHANNEL', { res });
            });
    },

    FETCH_VIDEOINFO: ({ commit, dispatch, state }, routeParam) => {
        return axios.post('/m_web/videoBase/videoBaseInfo', {
            videoBaseId: routeParam.params.videoBaseId,
            videoDetailId: routeParam.query.videoDetailId
        }).then(res => {
            commit('SET_VIDEOINFO', { res });
        });
    },

    /* 获取用户信息 */
    FETCH_USER: ({ commit, dispatch, state }, payload) => {
        const { shareToken, errorCallBack = () => { } } = payload || {};

        return request(fetchUser, {
            body: {
                shareToken
            }
        }, {
            successCallBack: (res) => {
                commit('SET_USER', { res });
            },
            errorCallBack
        });
    },

    /* 获取我拍列表 */
    FETCH_MY_VIEW_LIST: ({ commit, dispatch, state }, payload) => {
        const { shareToken, myViewListPaper = state.myViewListPaper || { limit: 30, offset: 1 }, errorCallBack = () => { } } = payload || {};
        if (!myViewListPaper.loading && !myViewListPaper.lastPage) {
            commit('SET_MY_VIEW_LIST_PAPER', { loading: true });
            return request(fetchMyViewList, {
                body: {
                    shareToken,
                    limit: myViewListPaper.limit, // true number 当前页码，从1开始
                    offset: myViewListPaper.offset, // true number 记录偏移
                    type: 1, // true number 0我的上传 1我拍 2有象故事
                }
            }, {
                successCallBack: (res) => {
                    commit('SET_MY_VIEW_LIST_PAPER', { loading: false });
                    commit('SET_MY_VIEW_LIST', { res });
                },
                errorCallBack
            });
        }
    },

    /* 获取个人主页动态 */
    FETCH_DYNAMICS_LIST: ({ commit, dispatch, state }, payload) => {
        const { shareToken, dynamicsListPaper = state.dynamicsListPaper || { limit: 30, offset: 2, loading: false, lastPage: false }, errorCallBack = () => { } } = payload || {};
        if (!dynamicsListPaper.loading && !dynamicsListPaper.lastPage) {
            commit('SET_DYNAMICS_LIST_PAPER', { loading: true });

            return request(fetchDynamicsList, {
                body: {
                    shareToken,
                    limit: dynamicsListPaper.limit, // true number 记录偏移
                    offset: dynamicsListPaper.offset, // true number 当前页码，从1开始
                }
            }, {
                successCallBack: (res) => {
                    commit('SET_DYNAMICS_LIST_PAPER', { loading: false });
                    commit('SET_DYNAMICS_LIST', { res });
                },
                errorCallBack
            });
        }
    }
};
