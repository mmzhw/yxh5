import Vue from 'vue';
import { getUnit } from '../util/index';
import { transformSecondToTime, getAstro } from '../util/index';
import { defaultUserAvatar } from '../util/imgSrc';
export default {
    SET_CHANNEL: (state, { res }) => {
        state.channels = res.data;
        let channelIdArr = res.data.slice().map(item => {
            if (item) {
                return item.id;
            }
        });
        state.channelIdArr = [0, ...channelIdArr];
    },

    SET_VIDEOINFO: (state, { res }) => {
        state.videoInfo = res.data;
    },

    /* 设置用户信息 */
    SET_USER: (state, { res }) => {
        if (res && res.data) {
            const standardUnit = [
                { level: 10000, unit: 'w' },
                { level: 10000000, unit: 'kw' },
            ];

            let {
                fansNumber = 0, // 粉丝数
                focusNumber = 0, // 关注数
                level, // 等级
                area, // 地区
                birthday, // 生日
                sex, // 性别 男1 女0
                individualitySignature,   // 个性签名
                avatar, // 头像
                // ...otherData, //其他
            } = res.data || {};
            if (sex === 1 || sex === '1') {
                sex = '男';
            }
            if (sex === 0 || sex === '0') {
                sex = '女';
            }
            state.userInfoData = {
                ...res.data,
                avatar: avatar || defaultUserAvatar,
                // avatar: defaultUserAvatar,
                fansNumber: fansNumber ? (getUnit(standardUnit, fansNumber)) : 0, /* 处理单位 12000 =》 1.2w */
                focusNumber: focusNumber ? (getUnit(standardUnit, focusNumber)) : 0,
                personInfoList: [
                    {
                        title: '个人信息',
                        id: 0,
                        rowList: [
                            {
                                label: '等级',
                                text: level,
                            }, {
                                label: '性别',
                                text: sex,
                            }, {
                                label: '生日',
                                text: getAstro(birthday),
                            }, {
                                label: '地区',
                                text: area,
                            }
                        ]
                    }, {
                        title: '个性签名',
                        id: 0,
                        rowList: [
                            {
                                text: individualitySignature || '暂未填写个人签名',
                            },
                        ]
                    },
                ],
            };
        } else {
            state.userInfoData = {};
        }
    },

    /* 获取个人主页动态 */
    SET_DYNAMICS_LIST: (state, { res }) => {
        if (res && res.data) {
            const { pager = {}, userActionVos = [] } = res.data;
            state.dynamicsList = userActionVos instanceof Array ? state.dynamicsList.concat(userActionVos.map(({ actionType, operateType, ...item }, key) => {
                const data = item.data || {};
                let actionName = '';
                let { name, nickName } = data;
                name = `"${name === undefined ? '' : name}"`;
                nickName = `"${nickName === undefined ? '' : nickName}"`;
                if (actionType === 1 && operateType === 1) {
                    actionName = `点赞了${name}`;
                } else if (actionType === 1 && operateType === 2) {
                    actionName = `收藏了${name}`;
                } else if (actionType === 1 && operateType === 3) {
                    actionName = `分享了${name}`;
                } else if (actionType === 1 && operateType === 4) {
                    actionName = `取消了对${name}收藏`;
                } else if (actionType === 1 && operateType === 5) {
                    actionName = `上传了${name}`;
                } else if (actionType === 2 && operateType === 0) {
                    actionName = `取消了对${nickName}关注`;
                } else if (actionType === 2 && operateType === 1) {
                    actionName = `关注了${nickName}`;
                } else if (actionType === 2 && operateType === 2) {
                    actionName = `分享了有象视频`;
                } else if (actionType === 2 && operateType === 3) {
                    actionName = `更新了个人信息`;
                } else if (actionType === 3 && operateType === 6) {
                    let videosName = data instanceof Array ? data.map(({ name }) => name).join('、') : '';
                    actionName = `删除了${videosName}`;
                } else if (actionType === 3 && operateType === 7) {
                    actionName = `删除了多个视频`;
                } else {
                }
                return {
                    gmtCreated: item.gmtCreated,
                    actionName,
                };
            })) : [];
            state.dynamicsListPaper = {
                ...state.dynamicsListPaper,
                ...pager,
                offset: pager.pageNo ? pager.pageNo + 1 : state.myViewListPaper,
                pages: pager.pages || state.pages,
            };
        } else {
            state.dynamicsListPaper = [];
        }
    },

    /* 获取'我拍'列表 */
    SET_MY_VIEW_LIST: (state, { res }) => {
        if (res && res.data) {
            const { videoShortVos = [], pager = {}} = res.data;
            state.myViewList = videoShortVos instanceof Array ? state.myViewList.concat(videoShortVos.map((item, key) => {
                return {
                    title: item.title,
                    picUrl: item.picUrl,
                    introduction: item.introduction,
                    id: item.id,
                    time: transformSecondToTime(item.duration),
                };
            })) : [];
            state.myViewListPaper = {
                ...state.myViewListPaper,
                ...pager,
                offset: pager.pageNo ? pager.pageNo + 1 : state.myViewListPaper,
                pages: pager.pages || state.pages,
            };
        } else {
            state.myViewList = [];
        }
    },
    /* 设置 myViewListPaper*/
    SET_MY_VIEW_LIST_PAPER: (state, payload) => {
        state.myViewListPaper = {
            ...state.myViewListPaper,
            ...payload
        };
    },

    /* 设置 dynamicsListPaper*/
    SET_DYNAMICS_LIST_PAPER: (state, payload) => {
        state.dynamicsListPaper = {
            ...state.myViewListPaper,
            ...payload
        };
    }
};
