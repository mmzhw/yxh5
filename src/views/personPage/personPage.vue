
<template>
    <div id="person-page" class="person-page" v-show="userInfoData">
        <div class="top-box">
          <div class="avatar" v-on:click="jumpApp">
            <img v-if="userInfoData.avatar" v-bind:src="userInfoData.avatar" alt="" />
            <img v-else src="../../assets/personPage/avatar.png" alt="" />
          </div>
          <div class="nickName">{{userInfoData.nickName}}</div>
          <div class="fans">
            <div class="fan">关注<span>{{userInfoData.focusNumber}}</span></div>
            <div class="fan">粉丝<span>{{userInfoData.fansNumber}}</span></div>
          </div>
          <div class="folllow-btn" v-on:click="jumpApp">关注</div>
        </div>
    <div class="bottom-box">
      <div class="tabs-box">
        <div class="tabs-title-box">
            <div v-for = "(item, index) in tabTtileItem" v-bind:key="index" v-on:click="()=>{tabOnChange(index)}" class="tabs-title" v-bind:class="{ 'tabs-title-active': index === tabActiveKey }">
              {{item.name}}
            </div>
        </div>
        <div class="tabs-content-box">
          <div class="tab-items" v-bind:style="styleTabItems">
            <div v-on:click="()=>{tabOnChange(0)}" class="tab-item"
                 v-bind:class="{'tab-item-avtive': 0 === tabActiveKey}">
              <MyViewList v-if="(myViewList instanceof Array && myViewList.length > 0)" v-bind:myViewList="myViewList" v-bind:goToVideo="goToVideo" v-bind:scroll="scroll" />
              <ErrorInPersonPage v-else v-bind:errorTipText="errorTipText.myViewList" />
            </div>
            <div v-on:click="()=>{tabOnChange(1)}" class="tab-item" v-bind:class="{ 'tab-item-avtive': 1 === tabActiveKey }">
              <Dynamics v-if="(dynamicsList instanceof Array && dynamicsList.length > 0)" v-bind:dynamicsList="dynamicsList" v-bind:avatar="userInfoData.avatar" v-bind:nickName="userInfoData.nickName" v-bind:scroll="scroll"/>
              <ErrorInPersonPage v-else v-bind:errorTipText="errorTipText.dynamics"  />
            </div>
            <div v-on:click="()=>{tabOnChange(2)}" class="tab-item"
                 v-bind:class="{ 'tab-item-avtive': 2 === tabActiveKey }">
              <AboutMe v-bind:personInfoList="userInfoData.personInfoList"/>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <div class="btn" v-on:click="jumpApp">去TA的个人主页</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AboutMe from './components/aboutMe/aboutMe.vue';
import Dynamics from './components/dynamics/dynamics.vue';
import MyViewList from './components/myViewList/myViewList.vue';
import ErrorInPersonPage from './components/errorInPersonPage/errorInPersonPage.vue';
// import titleMixin from '../../mixins/title-mixin';
import { jump } from '../../util/jump.js';

export default {
    name: 'person-page',
    // mixins: [titleMixin],
    components: {
        AboutMe, Dynamics, MyViewList, ErrorInPersonPage
    },

    data() {
        return {
             /* 鹏式命名法，百度不好找，嗯，  */
            tabTtileItem: [
                {
                    name: '我拍',
                    id: 0,
                }, {
                    name: '动态',
                    id: 1,
                }, {
                    name: '关于我',
                    id: 2,
                },
            ],  //  tabs 配置
            tabActiveKey: 0, //  tabs 活动id
            styleTabItems: {
                'touch-action': 'pan-x pan-y',
                left: '-0%',
                position: 'absolute'
            }, //  tabs 样式
            errorTipText: {
                myViewList: '还没有我拍记录哦，赶快去拍摄上传吧…',
                dynamics: '暂无动态记录哦…'
            }
        };
    },

    // asyncData({ store, route }) {
    //     return store.dispatch('FETCH_USER', {});
    // },

    computed: {
        ...mapState({
            dynamicsList: state => {
                return state.dynamicsList;
            },
            userInfoData: state => {
                return state.userInfoData;
            },
            myViewList: state => {
                return state.myViewList;
            },
            myViewListPaper: state => {
                return state.myViewListPaper;
            },
            dynamicsListPaper: state => {
                return state.dynamicsListPaper;
            }
        })
    },
    errorCallBack () {
        this.$router.push({ name: 'notFound' });
    },
    beforeMount () {
        const { query = {}} = this.$route || {};
        const { shareToken } = query;
        const errorCallBack = this.errorCallBack;
        /* 如果 shareToken(app,后台，前端 三方协定的变量) 没传 ，则直接取notFound界面 */
        if (shareToken === undefined) {
            this.$router.push({ name: 'notFound' });
        } else {
            const { $store = {}} = this;
            const { dispatch } = $store || {};
            dispatch('FETCH_USER', {
                shareToken,
                errorCallBack
            });
            dispatch('FETCH_MY_VIEW_LIST', {
                shareToken,
                errorCallBack
            });
            dispatch('FETCH_DYNAMICS_LIST', {
                shareToken,
                errorCallBack
            });
        }
    },
    mounted () {
    },
    methods: {
        tabOnChange(tabActiveKey) {
            this.styleTabItems = {
                ...this.styleTabItems,
                left: `-${tabActiveKey * 100}%`,
            };
            this.tabActiveKey = tabActiveKey;
        },
        jumpApp() {
            let { uid = '' } = this.userInfoData || { };
            if (uid) {
                jump.openBrowserToAppOrDownload({ action: 'personPage', id: uid });
            }
        },
        goToVideo(item) {
            // this.$router.push({ name: 'shortVideo' });
            this.$router.push({
                name: 'shortVideo',
                params: {
                    videoId: item.id
                }
            });
        },
        scroll(type, e) {
            const { scrollTop, offsetHeight, scrollHeight } = e.target || {};
            if (scrollTop !== undefined && offsetHeight !== undefined && scrollHeight !== undefined) {
                if (scrollTop + offsetHeight + 80 > scrollHeight) {
                    const { query = {}} = this.$route || {};
                    const { shareToken } = query;
                    const errorCallBack = this.errorCallBack;
                    /* 如果 shareToken(app,后台，前端 三方协定的变量) 没传 ，则直接取notFound界面 */
                    if (shareToken === undefined) {
                        this.$router.push({ name: 'notFound' });
                    } else {
                        const { $store = {}} = this;
                        const { dispatch } = $store || {};
                        if (type === 'dynamics') {
                            dispatch('FETCH_DYNAMICS_LIST', {
                                shareToken,
                                errorCallBack
                            });
                        } else if (type === 'myViewList') {
                            dispatch('FETCH_MY_VIEW_LIST', {
                                shareToken,
                                errorCallBack
                            });
                        } else {}
                    }
                }
            }
        }
    }
};
</script>

<style scoped>
.person-page {
  box-sizing: border-box;
  text-align: center;
  height: 100%;
  overflow: hidden;
  .top-box {
    height: 2rem;
    width: 100%;
    background: url("../../assets/personPage/bg.png") no-repeat center;
    color: #FFF;
    .avatar {
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      margin: 0 auto;
      padding: .05rem .2rem;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .nickName {
      font-size: .14rem;
      padding: .05rem 0;
    }
    .fans {
      padding: .05rem 0 .1rem;
      .fan {
        display: inline-block;
        text-align: right;
        padding: 0 .15rem;
        box-sizing: border-box;
        position: relative;
      }
      .fan span {
        padding-left: .05rem;
      }
      .fan::after {
        content: ' ';
        height: .12rem;
        width: 0;
        border-right: 1px solid rgba(255, 255, 255, .6);
        position: absolute;
        right: 0;
        top: .03rem;
      }
      .fan:last-child::after {
        height: 0;
        visibility: hidden;
        display: none;
      }
    }
    .folllow-btn {
      width: .88rem;
      height: .32rem;
      background: linear-gradient(180deg, rgba(255, 204, 0, 1), rgba(255, 187, 0, 1));
      border-radius: 2px;
      margin: 0 auto;
      color: #FFF;
      line-height: .32rem;
      font-size: .15rem;
    }
  }
  .bottom-box {
    background: rgba(247, 249, 250, 1);
    height: calc(100% - 2rem);
    .tabs-box {
      height: calc(100% - .64rem);
      .tabs-title-box {
        height: .5rem;
        line-height: .5rem;
        background: rgba(255, 255, 255, 1);
        text-align: center;
        cursor: pointer;
        .tabs-title {
          display: inline-block;
          width: calc(100% / 3);
          color: #999;
          position: relative;
          transition: left .2s;
        }
        .tabs-title:hover,
        .tabs-title-active {
          color: #333;
        }
        .tabs-title-active::before {
          content: " ";
          position: absolute;
          bottom: .1rem;
          left: 50%;
          margin-left: -.11rem;
          width: .22rem;
          height: .02rem;
          background: rgba(255, 189, 0, 1);
        }
      }
      .tabs-content-box {
        height: calc(100% - .5rem);
        position: relative;
        .tab-items {
          width: 300%;
          height: 100%;
          transition: left .4s;
        }
        .tab-item {
          width: calc(100% / 3);
          display: inline-block;
          height: 100%;
          vertical-align: top;
        }
      }
    }
    .btn-box {
      padding: .1rem;
      height: .44rem;
      line-height: .44rem;
      border-radius: .04rem;
      z-index: 5000;
      .btn {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
        border-radius: .04rem;
        height: 100%;
        color: #333;
        font-size: .16rem;
        font-family: 'PingFangSC-Regular';
      }
    }
  }
}
</style>
