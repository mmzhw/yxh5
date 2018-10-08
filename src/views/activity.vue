<template>
  <div class="wrap" :class="{'annual-meeting': channelInfo.type === 1}">
    <transition name="fade">
      <div class="loading-cover" v-if="!loadOver">
        <div class="content">
          <img :src="loadImg" alt="加载中">
          <p>正在加载...{{loadPrecent}}%</p>
        </div>
      </div>
    </transition>
    <!-- 直播专题模板 -->
    <template v-if="channelInfo.type === 0 || channelInfo.type === null">
      <!-- new-activity-model:  新的活动页模板播放器上移 -->
      <div class="live-player" :class="{ 'new-activity-model': activityId >= 100010 }" :style="{background: 'url(' + imageUrl + channelInfo.headImgMweb + ') no-repeat'}">
        <!-- 旧版保留 -->
        <span class="live-status" v-if="isLive && activityId < 100010">
          <div v-if="curLiveRoomStatus === 0" class="status-dot" style="background: #E70A0A;"></div>
          <div v-if="curLiveRoomStatus === 1" class="status-dot" style="background: #FABE00;"></div>
          <div v-if="curLiveRoomStatus === 2" class="status-dot" style="background: #999;"></div>
          {{ liveStatusMap[curLiveRoomStatus] }}
        </span>
        <!-- 新版启用 0直播中，1预热， 2回放  :测试阶段写0||1 -->
        <div class="liveLeftTime" v-if="isLive && activityId >= 100010 && curLiveRoomStatus === 1">
          <span>距直播开始: </span>
          <span class="LCDMono" ref="beforeNow"></span>
        </div>
        <!-- 0直播中，1预热， 2回放  -->
        <div class="player-box" v-show="tabs.length">
          <live-player :goplay="toplay" :options="vOptions"></live-player>
        </div>
      </div>
      <!-- 预热1 :测试阶段写1||0-->
      <template  v-if="isLive && activityId >= 100010 && curLiveRoomStatus === 1">
        <div class="likeWatch">
          <div>
            <div class="likeNum" :class="{'moveToBottom': likeClicked}">
              <animationNum :number="likeNum" :idx="index" v-for="(n, index) in likeNum.length" :key="index"/>
            </div>
            <div class="text"> 人想看</div>
            <div class="likeBtn" @click="likeClick(curLiveRoomId)" :class="{'clicked': likeClicked}">
              <div class="icon"></div>
              <div class="info">我也想看</div>
              <div class="alertInfo" :class="{'show-info': alertInfoStatus}">
                <!--<div class="alertInfo">-->
                <span>您已加入想看队伍了哦</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 直播中0 :测试阶段写0||1-->
      <template v-if="isLive && activityId >= 100010 && curLiveRoomStatus === 0">
        <div class="livePlaying">
          <div>
            <div class="watchNum">
              <animationNum :number="watchingNum" :idx="index" v-for="(n, index) in watchingNum.length" :key="index"/>
            </div>
            <div class="text"> 人在观看</div>
            <div class="live-time-status">
              <div class="live-background"></div>
              <div class="info">正在直播</div>
            </div>
          </div>
        </div>
      </template>
      <!-- 直播结束2 :测试阶段写2||1-->
      <template v-if="isLive && activityId >= 100010 && curLiveRoomStatus === 2">
        <div class="live-off">
          <div>
            <div class="watched-num">
              <animationNum :number="watchedNum" :idx="index" v-for="(n, index) in watchedNum.length" :key="index"/>
            </div>
            <div class="text"> 人观看过</div>
            <div class="live-time-status hide">
              <div class="live-background"></div>
              <div class="info" @click="playBack">点击回看</div>
            </div>
          </div>
        </div>
      </template>
      <div class="bgWrap" :style="{background: channelInfo.backType === 0 && channelInfo.backMweb ? 'url(' + imageUrl + channelInfo.backMweb + ') repeat' : channelInfo.backMweb}">
        <div class="live" v-show="tabs.length">
          <ul class="signals" v-if="tabs.length > 1">
            <li v-for='(item, index) in tabs' v-if="index < 4" @click='show($event, index)'>
              <span v-text="item.title" :class="{ 'is-active': item.iscur }"></span>
            </li>
          </ul>
          <div :class='foldStatus ? "desc" : "is-click desc"'>
            <template v-for="item in tabs">
              <div :class="{ 'is-active': item.iscur }" ref="detail" v-html="foldStatus || item.desc.length < 90 ? item.desc : item.intro"></div>
              <div :class='foldStatus ? "is-click more" : "more"' @click="handleFold()" v-if="item.desc.length > 90 && item.iscur">
                <span> {{ foldText }}</span>
                <i></i>
              </div>
            </template>
          </div>
        </div>
        <!-- 点播（非模板样式1x1）和广告 -->
        <div class="modules" v-for="(item, index) in models" v-if="(item.cardType === 2 && item.layoutId !== 1) || item.cardType === 3">
          <div v-if="item.cardType === 2">
            <div class="title" v-if="!item.titleStyleType">{{item.cardName}}</div>
            <div class="title-img" v-if="item.titleStyleType===1">
              <img :src="handleImgUrl(item.imgTitleStyleUrlM2)" v-if="item.multiply">
              <img :src="handleImgUrl(item.imgTitleStyleUrlM)" v-else>
            </div>
          </div>
          <!-- 点播：非模板1x1和1+2x2 -->          
          <div class="layout-1" v-if="item.cardType === 2 && [1, 7].indexOf(item.layoutId) === -1" :style="{background: item.buttomStyleType !== 0 ? 'rgba(255, 255, 255, .6)' : 'url(' + handleImgUrl(item.multiply ? item.imgButtomStyleUrlM2 : item.imgButtomStyleUrlM) + ') no-repeat top center'}">
            <div v-swiper="swiperOption" style="overflow: hidden;" :instanceName="index">
              <div class="swiper-wrapper">
                <ul class="swiper-slide" :class="{'swiper-slide-col-2': item.layoutId === 5}" v-for="pages in item.mdata.videos">
                  <li v-for="video in pages">
                    <a href="javascript:;" v-if="!video.url && !video.videoId">
                      <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                      <div class="video-content">
                        <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                        <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                      </div>
                    </a>
                    <a :href="video.url" v-if="video.url">
                      <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                      <div class="video-content">
                        <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                        <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                      </div>
                    </a>
                    <router-link :to="{name: 'Play', params: { videoBaseId: video.videoId }}" v-if="!video.url && video.videoId" style="display: block; position: relative;">
                      <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                      <div class="video-content">
                        <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                        <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                      </div>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="slide-more" v-if="item.mdata.videos.length > 1">
              <img src="../assets/activity/slide-more.png">
            </div>
          </div>
          <!-- 点播：模板1+2x2 -->
          <div class="layout-1" v-if="item.cardType === 2 && item.layoutId == 7" :style="{background: item.buttomStyleType !== 0 ? 'rgba(255, 255, 255, .6)' : 'url(' + handleImgUrl(item.imgButtomStyleUrlM) + ') no-repeat top center'}">
            <div v-swiper="swiperOption2" style="overflow: hidden;" :instanceName="index">
              <!-- 大视频轮播 -->
              <div class="swiper-wrapper">
                <ul class="swiper-slide swiper-slide-col-1" v-for="video in item.mdata.videos" v-if="video.type===0">
                  <li>
                    <a href="javascript:;" v-if="!video.url && !video.videoId">
                      <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                      <div class="video-content">
                        <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                        <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                      </div>
                    </a>
                    <a :href="video.url" v-if="video.url">
                      <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                      <div class="video-content">
                        <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                        <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                      </div>
                    </a>
                    <router-link :to="{name: 'Play', params: { videoBaseId: video.videoId }}" v-if="!video.url && video.videoId" style="position: relative;">
                      <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                      <div class="video-content">
                        <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                        <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                      </div>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div class="swiper-pagination swiper-pagination-bullets"></div>
            </div>
            <!-- 小视频2x2 -->
            <div class="swiper-wrapper">
              <ul class="swiper-slide">
                <li v-for="video in item.mdata.videos" v-if="video.type===1">
                  <a href="javascript:;" v-if="!video.url && !video.videoId">
                    <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                    <div class="video-content">
                      <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                      <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                    </div>
                  </a>
                  <a :href="video.url" v-if="video.url">
                    <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                    <div class="video-content">
                      <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                      <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                    </div>
                  </a>
                  <router-link :to="{name: 'Play', params: { videoBaseId: video.videoId }}" v-if="!video.url && video.videoId" style="position: relative;">
                    <img :src="handleImgUrl(video.imageUrl)" alt="" :style="{'border-bottom-left-radius': video.name.trim() === '' ? '.04rem' : '0', 'border-bottom-right-radius': video.name.trim === '' ? '.04rem' : '0'}">
                    <div class="video-content">
                      <p class="name" v-show="video.name && video.name.trim() !== ''">{{video.name}}</p>
                      <p class="subname" v-show="video.subName && video.subName.trim() !== ''" v-text="video.subName || ''"></p>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <!-- 广告 -->
          <div class="layout-2" v-if="item.cardType === 3 && item.mdata[0].imageUrl">
            <a :href="adv.contentUrl || 'javascript:;'" v-for="adv in item.mdata">
              <img @load="headImgLoaded()" :src="imageUrl + adv.imageUrl" alt="">
            </a>
          </div>
        </div>
        <div class="foot" :style="{paddingTop: channelInfo.footType === 0 ? '0' : '.5rem'}">
          <img v-if="channelInfo.footType === 0" :src="handleImgUrl(channelInfo.footImgMweb)" />
        </div>
      </div>
    </template>
    <!-- 年会模板 -->
    <template v-else="channelInfo.type === 1">
      <div class="cover-page-img" :class="{'clicked': annualMeetingClicked}" :style="{background: 'url(' + imageUrl + channelInfo.headImgMweb + ') no-repeat'}">
        <div class="to-nav-page" @click="annualMeeting"></div>
      </div>
      <div class="nav-page" :class="{'clicked': annualMeetingClicked}">
        <div class="asideBox" @click="navClick" :class="{'toLeft': toLeft}">
          <ul style="background: url('../assets/activity/page-loading.gif')">
            <li
              v-for="(item, index) in annualMeetingNavList" :key="index" class="summary-item"
              @click="navClickLi(item.id, index)"
            >
              <img :src="imgTitle(activityId, item.cardName)">
              <!--{{item.cardName}}-->
            </li>
          </ul>
        </div>
        <div class="annual-meeting-container" :class="{'toLeft': toLeft}">
          <annualMeetingDetail
            @getSources="getSourcesFormList" @back="openNav"
            v-for="(item, index) in annualMeetingNavList"
            :data="item" :key="index"
            :class="{'show': showDetailId === item.id, 'hide': showDetailId !== item.id}"
          >
          </annualMeetingDetail>
          <div class="playing-cover" :class="{'show': playingCover}" >
            <div class="player-box">
              <div class="closePlayer" @click="coverClick"></div>
              <video-player :options="vOptions"></video-player>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 回到首页 -->
    <router-link to="/">
      <img class="go-home" :class="{'down': !showFooter}" src="../assets/activity/icon_home.png" width="50" height="50">
    </router-link>
    <!-- 底导下载 -->
    <div class="download-footer" :class="{'down': !showFooter}">
      <img src="../assets/activity/icon_del.png" width="13" height="13" alt="" @click="showFooter = !showFooter">
      <img class="elephant" src="../assets/activity/icon_logo.png" width="44" height="44" alt="">
      <div class="download-text">
        <header>有象视频</header>
        <sub>下载观看完整高清视频</sub>
      </div>
      <button @click="handleDownLoadClick">下载APP</button> 
    </div>
  </div>
</template>

<script>
import livePlayer from '../components/liveVideo/index.vue';
import { wxShare } from '../util/wxShare.js';
import { imgTitle } from '../components/annualMeeting/config';
import { imageUrl, videoUrl } from '../util/index.js';
import animationNum from '../components/animationNum/animationNum.vue';
import annualMeetingDetail from '../components/annualMeeting/details.vue';
import videoPlayer from '../components/video/Video.vue';

export default {
    name: 'activity',
    components: {
        livePlayer,
        animationNum,
        annualMeetingDetail,
        videoPlayer
    },
    data() {
        return {
            pageTitle: '',
            activityId: 0,
            vOptions: {
                sources: [],
                controls: true,
                poster: '',
            },
            headImg: null,
            loadPrecent: 0,
            toplay: false, // 触发播放
            liveStatusMap: {
                0: '正在直播',
                1: '准备直播',
                2: '直播结束'
            },
            loadOver: false,
            loadImg: require('../assets/activity/page-loading.gif'),
            fakePrcentInterval: null,
            headerImageLoaded: false,
            warmUpVideoList: [],
            currentWarmUpVideoIndex: 0,
            playbackUrl: '',
            timeLeft: null,
            result: {
                displayImageUrl: '',
                playbackStatus: 0
            },
            swiperOption: {},
            swiperOption2: {
                direction: 'horizontal',
                initialSlide: 0,
                loop: true,
                pagination: '.swiper-pagination',
                autoplayDisableOnInteraction: false,
            },
            tabs: [],
            currentTab: 0,
            curLiveRoomId: '',
            curLiveRoomStatus: 0,
            models: [],
            channelInfo: [],
            foldStatus: false,
            foldText: '展开',
            imageUrl: imageUrl,
            videoUrl: videoUrl,
            intervalRoomStatus: null,
            intervalLiveStatus: null,
            restTime: null,  // 完整输出格式的倒计时
            isLive: null,
            likeNum: 0,   // 想看的人数
            watchingNum: 0, // 直播中的观众
            watchedNum: 0, // 累计所有的观众
            alertInfoStatus: false, // 重复参与想看状态
            play_back_status: 1, // 回放状态监听
            likeClicked: false, // 点击过想看按钮
            annualMeetingClicked: false, // 年会专题模板首图按钮点击状态
            annualMeetingNavList: [], // 年会导航列表
            toLeft: false, // 导航折叠
            showDetailId: null, // 显示的年会详情列表id
            imgTitle: imgTitle,
            playingCover: false, // 播放遮罩层,
            showFooter: true
        };
    },
    computed: {
        backStyle: function () {
            return {
                active: this.isActive && !this.error,
                'text-danger': this.error && this.error.type === 'fatal'
            };
        }
    },
    created() {
        this.activityId = this.$route.params.activityId;
//    setInterval(function () {
//      timeBefore(1514543616530)
//    }, 1000)
        this.showDetailId = this.$route.query.navId;
        if (this.showDetailId) {
            this.annualMeetingClicked = true;
        }
    },
    mounted() {
        let loadImg = new Image();
        loadImg.src = this.loadImg;
        loadImg.onload = () => {
            this.startLoaded();
        };
        if (process.browser) {
            const jsBridge = require('../util/bridge');
            var responseData = {
                'code': '0000',
                'data': {
                    'title': '【有象视频·直播】2017金诚集团运动会SPORTS MEETING',
                    'subTitle': '运动何止眼前的美好 金诚让生命永不止息',
                    'content': '运动何止眼前的美好 金诚让生命永不止息',
                    'imgUrl': 'https://image.youxiang0210.com/back-1509091898310-fenxiang.jpg',
                    'shareUrl': 'https://m.youxiang0210.com/activity/100001'
                },
                'msg': ''
            };
            if (this.activityId === '100002') {
                responseData.data.imgUrl = 'https://image.youxiang0210.com/back-1509435090876-400-400.jpg';
                responseData.data.title = '中国国际时装周-杰宝怡网络独家冠名';
                responseData.data.subTitle = '杰宝怡(ZEBOOIE)邀你共赴时尚盛宴';
                responseData.data.content = '杰宝怡(ZEBOOIE)邀你共赴时尚盛宴';
                responseData.data.shareUrl = 'https://m.youxiang0210.com/activity/100002';
            } else if (this.activityId === '100003') {
                responseData.data.imgUrl = 'https://image.youxiang0210.com/back-1511169016843-WechatIMG13006.jpg';
                responseData.data.title = '有象拍客大计年度作品评选大赛';
                responseData.data.subTitle = '入围拍客将有机会赢取万元大奖';
                responseData.data.content = '入围拍客将有机会赢取万元大奖';
                responseData.data.shareUrl = 'https://m.youxiang0210.com/activity/100003';
            }
            jsBridge.register('base_getShareContent', function (data, responseCallback) {
                responseCallback(responseData);
            });
        }
        this.axios.post('/m_web/special/channel/lists', { id: this.activityId }).then((res) => {
            if (res.code === 0) {
                this.models = res.data.models;
                this.channelInfo = res.data.channelInfo;
                let counter = 0;
                this.models.forEach(item => {
                    if (item.cardType === 1) {
                        this.isLive = true;
                        this.tabs = this.tabs.concat(item.mdata.map((v, i) => {
                            return {
                                'title': v.name,
                                'desc': v.liveDesc,
                                'intro': v.liveDesc.slice(0, 89) + '...',
                                'iscur': false,
                                hlsPlayUrl: v.hlsPlayUrl,
                                image: i === 0 ? item.imageBannerUrl : v.imgUrl,
                                liveRoomStatus: v.liveRoomStatus,
                                liveRoomId: v.liveRoomId,
                                playbackStatus: v.playbackStatus,
                                playbackUrl: v.playbackUrl,
                                timeLeft: v.scheduleTime
                            };
                        }));
                        this.currentTab = 0;
                        this.curLiveRoomId = this.tabs[0].liveRoomId;
                        this.autoAddLikeNum(this.curLiveRoomId);
                        this.getLiveingStatus();
                        this.timeLeft = this.tabs[0].timeLeft;  // 直播剩余开播时间
                        this.tabs[0].iscur = true;
                        if (this.activityId === '100010') {
                            this.vOptions.poster = 'https://image.youxiang0210.com/back-1514189673410-HzV90mPl1T';
                        } else {
                            this.vOptions.poster = imageUrl + this.tabs[0].image;
                        }
                        this.curLiveRoomStatus = this.tabs[0].liveRoomStatus;
                        if (this.tabs[0].liveRoomStatus === 1) {
                            this.getWarmUpVideo(this.tabs[0].liveRoomId);
                            this.intervalStatus();
                            this.intervalLiveTime();
                        } else if (this.tabs[0].liveRoomStatus === 0) {
                            this.vOptions.sources = [{
                                src: this.tabs[0].hlsPlayUrl,
                                type: 'application/x-mpegURL',
                            }];
                            this.intervalStatus();
                        } else if (this.tabs[0].liveRoomStatus === 2) {
                            this.play_back_status = this.tabs[0].playbackStatus;
                            if (this.tabs[0].playbackStatus === 0) {  // 100010期特殊处理
                                this.getWarmUpVideo(this.curLiveRoomId);
                            } else {
                                this.vOptions.sources = [{
                                    src: this.tabs[0].playbackUrl,
                                    type: 'application/x-mpegURL',
                                }];
                            }
                            this.intervalStatus();  // 回看状态增加心跳
                        }
                    }
                    if (item.cardType === 2) {
                        this.annualMeetingNavList.push(item); // 年会导航
                        if (item.layoutId === 4) {
                            item.multiply = counter % 2 === 1;
                            counter++;
                        }
                        // 点播：1x1
                        if (item.layoutId === 1) {
                            this.isLive = false;
                            this.vOptions.poster = imageUrl + item.imageBannerUrl;
                            this.tabs[0] = {
                                'desc': item.mdata.videos[0].intro,
                                'intro': item.mdata.videos[0].intro.slice(0, 89) + '...',
                                'iscur': true,
                            };
                            this.vOptions.sources = [{
                                src: videoUrl + item.mdata.videos[0].videoResourceStatusVo.m3u8Clarity.url,
                                type: 'application/x-mpegURL',
                            }];
                        } else if (item.layoutId !== 7) {
                            let perPage; // swiper分页
                            switch (item.layoutId) {
                                case 2 : perPage = 4; break;
                                case 3 : perPage = 6; break;
                                case 4 : perPage = 6; break;
                                case 5 : perPage = 2; break;
                                case 6 : perPage = 6; break;
                                default : break;
                            }
                            item.mdata.videos = Array.apply(null, {
                                length: Math.ceil(item.mdata.videos.length / perPage)
                            }).map((x, i) => {
                                return item.mdata.videos.slice(i * perPage, (i + 1) * perPage);
                            });
                        }
                    }
                });
//        sessionStorage.setItem('annualMeetingNavList', JSON.stringify(this.annualMeetingNavList)) // 传值给年度活动页
                let channelInfo = res.data.channelInfo;
                this.pageTitle = channelInfo.title;
                document.title = this.pageTitle;

                const bridge = require('../util/bridge');
                bridge.call('base_callShareContent', {
                    title: channelInfo.shareTitle,
                    subTitle: channelInfo.shareDesc,
                    imgUrl: imageUrl + channelInfo.shareImg,
                    shareUrl: location.href
                }, () => {
                });
                wxShare(channelInfo.shareTitle, channelInfo.shareDesc, imageUrl + channelInfo.shareImg);
            } else if (res.code === 81001) {
                this.$router.push({ name: 'notFound' });
            }
        });
    },
    methods: {
        fakePrcent() {
            let leftNu = 100 - this.loadPrecent;
            let duration = 200;
            if (leftNu >= 10) {
                duration = 30;
            } else if (leftNu < 10 && leftNu > 5) {
                duration = 50;
            } else {
                duration = 70;
            }
            if (this.headerImageLoaded) {
                this.fakePrcentInterval = setInterval(() => {
                    if (this.loadPrecent <= 99) {
                        this.loadPrecent++;
                    }
                }, duration);
                setTimeout(() => {
                    clearInterval(this.fakePrcentInterval);
                    this.loadOver = true;
                }, duration * leftNu);
            } else {
                this.headImgLoadedEvent();
            }
        },
        headImgLoadedEvent() {
            clearInterval(this.fakePrcentInterval);
            if (this.loadPrecent === 99) {
                this.loadPrecent++;
            } else {
                let time = 100 - this.loadPrecent;
                let lastInterval = setInterval(() => {
                    this.loadPrecent++;
                }, 10);
                setTimeout(() => {
                    clearInterval(lastInterval);
                    this.loadOver = true;
                }, 10 * time);
            }
        },
        startLoaded() {
            let intervalCount = setInterval(() => {
                this.loadPrecent++;
            }, 10);
            setTimeout(() => {
                clearInterval(intervalCount);
                this.fakePrcent();
            }, 840);
        },
        headImgLoaded() {
            this.headerImageLoaded = true;
        },
        show(e, index) {
            clearInterval(this.intervalLiveStatus);
            clearInterval(this.intervalRoomStatus);
            this.tabs.forEach((v, i) => {
                i === index ? v.iscur = true : v.iscur = false;
            });
            this.currentTab = index;
            this.curLiveRoomId = this.tabs[index].liveRoomId;
            this.curLiveRoomStatus = this.tabs[index].liveRoomStatus;
            this.warmUpVideoList = [];
            if (this.curLiveRoomStatus === 1) {
                this.getWarmUpVideo(this.curLiveRoomId);
                this.intervalStatus();
                this.intervalLiveTime();
            } else if (this.curLiveRoomStatus === 0) {
                this.vOptions.sources = [{
                    src: this.tabs[index].hlsPlayUrl,
                    type: 'application/x-mpegURL',
                }];
                this.intervalStatus();
            } else if (this.curLiveRoomStatus === 2) {
                this.play_back_status = this.tabs[index].playbackStatus;
                if (this.tabs[index].playbackStatus && this.tabs[index].playbackUrl) {
                    this.vOptions.sources = [{
                        src: this.tabs[index].playbackUrl,
                        type: 'application/x-mpegURL',
                    }];
                } else {
                    this.getWarmUpVideo(this.curLiveRoomId); // 回看状态为0播放预热视频
//            this.vOptions.sources = [{}]
                }
                this.intervalStatus(); // 回看状态增加心跳
            } else {
                this.vOptions.sources = [{}];
            }
            this.vOptions.poster = imageUrl + this.tabs[index].image;
        },
        getWarmUpVideo(liveRoomId) {
            this.vOptions.sources = [{}];
            this.axios.post('/m_web/liveRoom/warmUpVideoList', { liveRoomId }).then((res) => {
                const result = res.data;
                for (let i = 0; i < result.length; i++) {
                    const item = result[i].vVideoDetailRspVos;
                    for (let j = 0; j < item.length; j++) {
                        this.warmUpVideoList.push(`https://video.youxiang0210.com/${item[j].videoResourceStatusVo.m3u8Clarity.url}`);
                    }
                }

                if (this.warmUpVideoList.length > 0) {
                    this.vOptions.sources = [{
                        src: this.warmUpVideoList[0],
                        type: 'application/x-mpegURL'
                    }];
                    this.currentWarmUpVideoIndex = 0;
                }
            });
        },
        handleFold(index) {
            const val = this.foldStatus;
            this.foldStatus = !val;
            if (this.foldStatus) {
                this.foldText = '收起';
            } else {
                this.foldText = '展开';
            }
        },
        getLiveingStatus() {
            this.axios.post('/m_web/liveRoom/getRecordByLiveRoomId', {
                liveRoomId: this.curLiveRoomId
            }).then((res) => {
                const data = res.data;
                this.likeNum = (data.interested).toString(); // 想看的人数
                this.watchingNum = (data.watching + data.interested).toString(); // 直播在线人数
                this.watchedNum = (data.watched).toString(); // 直播在线人数
                if (this.curLiveRoomStatus === data.liveStatus) {
                    if (data.liveStatus === 2 && this.play_back_status !== data.playbackStatus) {
                        if (data.playbackStatus === 0) { // 回看状态为0播放预热视频
                            this.getWarmUpVideo(this.curLiveRoomId);
                        } else {
                            this.vOptions.sources = [{
                                src: this.tabs[this.currentTab].playbackUrl,
                                type: 'application/x-mpegURL',
                            }];
                        }
                    }
                    return;
                }
                if (data.liveStatus === 0) {
                    this.vOptions.sources = [{
                        src: this.tabs[this.currentTab].hlsPlayUrl,
                        type: 'application/x-mpegURL'
                    }];
                    this.toplay = true;
                } else if (data.liveStatus === 1) {
                    this.getWarmUpVideo(this.tabs[this.currentTab].liveRoomId);
                    this.toplay = true;
                } else if (data.liveStatus === 2) {
                    if (data.playbackStatus === 0) { // 回看状态为0播放预热视频
                        this.getWarmUpVideo(this.curLiveRoomId);
                    } else {
                        this.vOptions.sources = [{
                            src: this.tabs[this.currentTab].playbackUrl,
                            type: 'application/x-mpegURL',
                        }];
                    }
                }
                this.curLiveRoomStatus = data.liveStatus;
            });
        },
        intervalStatus() {
            if (this.channelInfo.type === 1) {
                return;
            }
            this.getLiveingStatus();
            this.intervalRoomStatus = setInterval(this.getLiveingStatus, 10000);
        },
        intervalLiveTime() {
            if (this.channelInfo.type === 1) {
                return;
            }
            var timeFormat = null;
            this.intervalLiveStatus = setInterval(() => {
                let restSeconds = ~~((parseInt(this.timeLeft) - Date.now()) / 1000);
                if (restSeconds <= 0) {
                    timeFormat = {
                        days: '0',
                        hours: '00',
                        mins: '00',
                        secs: '00'
                    };
                } else {
                    timeFormat = {
                        days: ~~(restSeconds / 86400),
                        hours: this.padstart(~~((restSeconds / 3600) % 24), 2),
                        mins: this.padstart(~~((restSeconds / 60) % 60), 2),
                        secs: this.padstart(~~(restSeconds % 60), 2)
                    };
                }
                // this.restTime = timeFormat.days + '天 ' + timeFormat.hours + ':' + timeFormat.mins + ':' + timeFormat.secs;
                this.$refs.beforeNow.innerHTML = timeFormat.days + '天 ' + timeFormat.hours + ':' + timeFormat.mins + ':' + timeFormat.secs;
            }, 1000);
        },
        handleImgUrl (url, preffix = imageUrl, suffix) {
            if (url === '' || url === null || url === undefined || url.indexOf('http') === 0) return require('../assets/activity/elephant.png');
            if (!suffix) suffix = '';
            return preffix + url + suffix;
        },
        likeClick (liveRoomId) {
            if (this.likeClicked) {
                if (this.alertInfoStatus === false) {
                    this.alertInfoStatus = true;
                    let _this = this;
                    let timer = setTimeout(() => {
                        _this.alertInfoStatus = false;
                        clearTimeout(timer);
                        timer = null;
                    }, 2000);
                }
                return;
            }
            this.likeClicked = true;
//      this.axios.post('/m_web/liveRoom/view', { liveRoomId }).then((res) => {
//  //      this.getLiveingStatus()  // 轮询接口时间较短不需要这里
//      })
        },
        playBack () {
            let player = document.querySelector('video');
            player.play();
        },
        padstart (num, len) {
            let str = '0000000000';
            return (str + num).slice(-len);
        },
        autoAddLikeNum (liveRoomId) {
            this.axios.post('/m_web/liveRoom/view', { liveRoomId }).then((res) => {
//        this.getLiveingStatus()  // 轮询接口时间较短不需要这里
            });
        },
    /* 年会专题相关功能 */
        annualMeeting () { // 年会首页按钮
            this.annualMeetingClicked = true;
        },
        navClickLi (navId) {
            this.showDetailId = navId;
            this.$router.replace({
                name: 'activity',
                query: { navId: navId }
            });
            let dom = document.querySelector('.nav-page');
            dom.style.transition = 'transform .45s';
            dom.scrollTop = 0;
        },
        navClick () {
            this.toLeft = true;
        },
        openNav () {
            this.toLeft = false;
            setTimeout(() => {
                this.showDetailId = null;
            }, 510);
            this.$router.replace({
                name: 'activity'
            });
        },
        coverClick () {
            this.playingCover = false;
            document.querySelector('video').pause();
        },
        getSourcesFormList (id) {
            this.axios.post('/m_web/videoBase/videoBaseInfo', {
                'videoBaseId': id
            })
      .then(res => {
          this.playingCover = true;
          this.vOptions.sources = [{
              src: this.videoUrl + res.data.vVideoDetailRspVos[0].videoResourceStatusVo.mp4Review.url,
              type: 'video/mp4',
          }];
      });
        },
        // 下载
        handleDownLoadClick() {
            const ua = navigator.userAgent;
            if (/MicroMessenger/i.test(ua)) {
                location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.daxiang.live';
            } else if (/android/i.test(ua)) {
                location.href = 'http://dx-downloads-test.itangchao.me/daxiang-live-A_OFFICAL-release.apk';
            } else if (/iPhone/i.test(ua)) {
                location.href = 'https://itunes.apple.com/us/app/id1235011792?l=zh&ls=1&mt=8';
            }
        }
    },
};
</script>

<style scoped>
.wrap {
  overflow: hidden;
  &.annual-meeting {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .ql-size-12 {
    font-size: 12px;
  }
  .ql-size-14 {
    font-size: 14px;
  }
  .ql-size-16 {
    font-size: 16px;
  }
  .ql-size-18 {
    font-size: 18px;
  }
  .ql-size-20 {
    font-size: 20px;
  }
  .top {
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
  }
  .live {
    margin-bottom: .1rem;
  }
  .live-player {
    height: 100%;
    padding: 0 .08rem;
    padding-top: 2.08rem;
    position: relative;
    background-size: 100% !important;
    .live-status {
      font-size: 10px;
      position: absolute;
      color: #FFF;
      z-index: 2;
      background: rgba(1, 1, 1, .2);
      border-radius: .02rem;
      left: 0;
      right: 0;
      top: 2.18rem;
      margin: auto;
      width: 66px;
      text-align: center;
      padding: .03rem .05rem;
      .status-dot {
        display: inline-block;
        border-radius: 50%;
        margin-right: .02rem;
        width: 8px;
        height: 8px;
      }
    }
    .liveLeftTime { /* 直播剩余开播时间 */
      position: absolute;
      top: .76rem;
      left: 50%;
      color: #FFC825;
      z-index: 2;
      width: 1.68rem;
      background: rgba(0, 0, 0, .3);
      padding: .02rem .1rem;
      height: .13rem;
      line-height: .13rem;
      font-size: 12px;
      transform: translate(-50%, 0);
      -webkit-transform: translate(-50%, 0);
      -ms-: translate(-50%, 0);
      -o-: translate(-50%, 0);
      text-align: center;
      border-radius: .05rem;
      font-weight: bold;
      .LCDMono {
        font-family: 'LCDMono' !important;
      }
    }
    &.new-activity-model {
      padding-top: .694rem;
      .live-status {
        top: .8rem;
      }
    }
    .player-box {
      padding: .02rem;
      background: #222;
      .vjs-melephant .vjs-melephant-error .content-wrap {
        margin-top: -1.6rem;
      }
      .vjs-melephant .vjs-melephant-loading .content-wrap {
        margin-top: -1.45rem;
      }
      .vjs-melephant .vjs-melephant-ended .content-wrap {
        margin-top: -1.6rem;
      }
    }
  }
  .likeWatch {
    text-align: center;
    background: #E3E3E3;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #DCDCDC;
    & > div {
      width: 100%;
      height: 100%;
      background: #FFF;
    }
    .likeNum {
      margin-left: 14px;
      float: left;
      height: 48px;
      overflow: hidden;
      & > li {
        color: #FFC825;
        font-size: 16px;
      }
    }
    .text {
      color: #161616;
      font-size: 12px;
      height: 48px;
      line-height: 48px;
      float: left;
    }
    .likeBtn {
      float: right;
      margin-top: 10px;
      margin-right: 12px;
      background-size: 100% 100%;
      width: 97px;
      height: 26px;
      border: 1px solid #FFC825;
      border-radius: 30px;
      position: relative;
      color: #1E1E1E;
      .icon {
        float: left;
        width: 17px;
        height: 16px;
        margin-top: 3px;
        margin-left: 10px;
        background: url("../assets/indexChannel/likeWatch.png") no-repeat center;
        background-size: 100%;
        position: relative;
        top: 3px;
        margin-right: 2px;
      }
      &.clicked {
        .icon {
          background: url("../assets/indexChannel/likeWatch_on.png") no-repeat center;
          background-size: 100%;
        }
      }
      .info {
        float: left;
        margin-left: 5px;
        font-size: 13px;
        height: 26px;
        line-height: 26px;
      }
      .alertInfo {
        display: none;
        width: 116px;
        height: 32px;
        line-height: 34px;
        font-size: 10px;
        color: #FFF;
        background: url("../assets/indexChannel/alert_info_bg.png") no-repeat center;
        background-size: 100%;
        position: absolute;
        top: 26px;
        left: -10px;
        &.show-info {
          display: block;
        }
        span {
          position: relative;
          top: 1.5px; /* top: 1.15px; */
        }
      }
    }
  }
  .livePlaying {
    text-align: center;
    background: #E3E3E3;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #DCDCDC;
    & > div {
      width: 100%;
      height: 100%;
      background: #FFF;
    }
    .watchNum {
      margin-left: 14px;
      float: left;
      height: 48px;
      overflow: hidden;
      & > li {
        color: #FFC825;
        font-size: 16px;
      }
    }
    .text {
      color: #161616;
      font-size: 12px;
      height: 48px;
      line-height: 48px;
      float: left;
    }
    .live-time-status {
      float: right;
      margin-right: 12px;
      background-size: 100% 100%;
      width: 97px;
      height: 100%;
      color: #1E1E1E;
      .live-background {
        float: left;
        width: 33px;
        height: 100%;
        background: url("../assets/indexChannel/live_time_icon.png") no-repeat center;
        background-size: 100%;
      }
      .info {
        float: left;
        font-size: 13px;
        height: 100%;
        width: 52px;
        line-height: 48px;
      }
    }
  }
  .live-off {
    text-align: center;
    background: #E3E3E3;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #DCDCDC;
    & > div {
      width: 100%;
      height: 100%;
      background: #FFF;
    }
    .watched-num {
      margin-left: 14px;
      float: left;
      height: 48px;
      overflow: hidden;
      & > li {
        color: #FFC825;
        font-size: 16px;
      }
    }
    .text {
      color: #161616;
      font-size: 12px;
      height: 48px;
      line-height: 48px;
      float: left;
    }
    .live-time-status {
      float: right;
      margin-right: 12px;
      background-size: 100% 100%;
      width: 97px;
      height: 100%;
      color: #1E1E1E;
      .live-background {
        float: left;
        width: 18px;
        margin-right: 8px;
        margin-left: 4px;
        height: 100%;
        background: url("../assets/indexChannel/live_end_icon.png") no-repeat center;
        background-size: 100%;
      }
      .info {
        float: left;
        font-size: 13px;
        height: 100%;
        line-height: 48px;
      }
    }
  }
  .bgWrap {
    height: 100%;
    background-size: contain !important;
  }
  .live {
    .signals {
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      padding: 0 .06rem;
      display: flex;
      li {
        flex: 1;
        width: .85rem;
        height: .4rem;
        overflow: hidden;
        line-height: .4rem;
        margin: .06rem .03rem .09rem;
        background: #151824;
        color: #FFF;
        font-size: 14px;
        text-align: center;
        .is-active {
          color: #FABE00;
        }
      }
    }
    .desc {
      height: auto;
      background: #FFF;
      color: #222;
      font-size: 12px;
      line-height: .16rem;
      padding: .22rem .15rem .35rem;
      box-sizing: border-box;
      .more {
        display: inline-block;
        float: right;
        width: .43rem;
        height: .12rem;
        margin-top: .1rem;
      }
      .is-click {
        i {
          background: url(../assets/activity/t-point.png) center center no-repeat;
          background-size: contain;
        }
      }
      i {
        display: inline-block;
        width: .08rem;
        height: .06rem;
        background: url(../assets/activity/b-point.png) center center no-repeat;
        background-size: contain;
        margin-left: 3px;
      }
      div {
        display: none;
        &.is-active {
          display: block;
        }
      }
    }
  }
  .modules {
    .slide-more {
      text-align: center;
      img {
        width: 2.36rem;
        margin: 0 auto;
        margin-bottom: .09rem;
      }
    }
    .layout-1 {
      margin: 0 .08rem;
      font-size: 12px;
      background: rgba(255, 255, 255, .6);
      background-size: 100% 100% !important;
      img {
        border-radius: .04rem;
      }
    }
    .layout-2 {
      display: flex;
      img {
        border-radius: .04rem;
      }
      a {
        flex: 1;
        img {
          display: block;
          width: 100%;
          height: .8rem;
        }
      }
    }
    .title {
      display: block;
      width: 3.59rem;
      color: #242424;
      font-size: .16rem;
      margin: 0 .1rem .15rem;
      padding-top: .2rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }
    .title-img {
      padding-top: .2rem;
      margin-bottom: .15rem;
      img {
        display: block;
        margin: 0 auto;
        max-width: 100%;
      }
    }
    .swiper-slide {
      padding: 0 .08rem .1rem;
      box-sizing: border-box;
      margin-top: -.02rem;
      display: flex;
      flex-wrap: wrap;
      li {
        overflow: hidden;
        display: inline-block;
        width: 1.69rem;
        margin-top: .12rem;
        border-radius: .04rem; /* 专题页底部标题圆角 */
        vertical-align: top;
        &:nth-child(even) {
          margin-left: auto;
        }
        .video-content {
          border-bottom-left-radius: .04rem;
          border-bottom-right-radius: .04rem;
          background: #F2F2F2;
        }
        p {
          padding: .06rem;
          padding-bottom: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          overflow: hidden;
        }
        .name {
          font-weight: bold;
          padding-bottom: .06rem;
        }
        .subname {
          color: #9B9B9B;
          padding-top: 0;
          padding-bottom: .06rem;
        }
        img {
          overflow: hidden;
          display: block;
          width: 100%;
          height: .95rem;
        }
      }
    }
    .swiper-slide-col-1 {
      li {
        width: 100%;
        height: auto;
        border-radius: .04rem;
        img {
          width: 3.43rem;
          height: 2.55rem;
        }
      }
    }
    .swiper-slide-col-2 {
      li {
        height: auto;
        img {
          height: 2.53rem;
          width: 1.69rem;
        }
      }
    }
  }
  .swiper-pagination.swiper-pagination-bullets {
    bottom: .65rem;
  }
  .foot {
    margin-bottom: .55rem;
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
  .loading-cover {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: #FFF;
    z-index: 11;
    text-align: center;
    .content {
      margin-top: 50%;
      transform: translateY(-50%);
      img {
        width: .9rem;
      }
      p {
        color: #AAA;
        font-size: 16px;
      }
    }
  }
  .hide {
    display: none;
  }
  .cover-page-img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-size: 100% 100% !important;
    &.clicked {
      display: none;
    }
    .to-nav-page {
      width: 1.63rem;
      height: 1rem;
      position: absolute;
      bottom: .3rem;
      left: 50%;
      transform: translate(-50%, 0);
      -webkit-transform: translate(-50%, 0);
      -ms-transform: translate(-50%, 0);
      -o-transform: translate(-50%, 0);
    }
  }
  .nav-page {
    display: none;
    color: #FFF;
    overflow-y: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    -webkit-overflow-scrolling: touch;
    & > div {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      z-index: 9;
      transition: left .5s, right .5s;
      -webkit-transition: left .5s, right .5s;
      -moz-transition: left .5s, right .5s;
      -o-transition: left .5s, right .5s;
    }
    .asideBox {
      z-index: 20;
      background: #000;
    }
    .asideBox.toLeft {
      left: -3.75rem;
      right: 3.75rem;
    }
    &.clicked {
      display: block;
      top: 0;
    }
    .asideBox > ul { /* background: #2C2846; */
      li {
        line-height: .6rem;
        text-align: left;
        font-size: .18rem;
        height: 1rem;
        font-family: 'SimHei';

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .playing-cover {
      display: none;
      position: fixed;
      z-index: 999;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      background: rgba(0, 0, 0, .5);
      width: 100%;
      height: 100%;
      &.show {
        display: block;
      }
      .player-box {
        width: 100%;
        height: 2.14rem; /* 2.11? */
        background: #666;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -1.07rem;
        .closePlayer {
          position: absolute;
          right: .1rem;
          top: -.5rem;
          width: .4rem;
          height: .4rem;
          z-index: 9999;
          background: url("../../public/annualMeeting/img_close.png") no-repeat;
          background-size: 100%;
          border-radius: 50%;
        }
        .video-player,
        .video-js,
        .vjs-user-inactive,
        video {
          width: 100% !important;
          height: 100% !important;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.video-player,
.video-js,
.vjs-user-inactive,
video {
  width: 100% !important;
  height: 100% !important;
}

.go-home {
  position: fixed;
  z-index: 10;
  right: .1rem;
  bottom: .65rem;
  transition: .5s bottom ease-in-out;
  -webkit-transition: .5s bottom ease-in-out;
  -moz-transition: .5s bottom ease-in-out;
  -o-transition: .5s bottom ease-in-out;
  &.down {
    bottom: .1rem;
  }
}

.download-footer {
  position: fixed;
  z-index: 10;
  bottom: 0;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  height: .55rem;
  display: flex;
  align-items: center;
  background: #FFF;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, .04);
  transition: .5s transform ease-in-out;
  -webkit-transition: .5s transform ease-in-out;
  -moz-transition: .5s transform ease-in-out;
  -o-transition: .5s transform ease-in-out;
  &.down {
    transform: translateY(100%);
  }
  .elephant {
    margin: 0 .1rem;
  }
  button {
    margin-left: auto;
    width: .88rem;
    height: .34rem;
    line-height: .34rem;
    background: linear-gradient(180deg, rgba(255, 204, 0, 1), rgba(255, 187, 0, 1));
    border-radius: .02rem;
    font-size: .15rem;
    color: #FFF;
  }
}

.download-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  header {
    font-size: .16rem;
    color: #1A1A1A;
  }
  sub {
    font-size: .12rem;
    line-height: 1.5;
    color: #808080;
  }
}
</style>
