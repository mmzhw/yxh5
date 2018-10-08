<template>
  <div class="channel-view">
    <template v-if="legoChannels.length > 0 || bannerData.length > 0">
      <Banner v-if="bannerData.length > 0" :items="bannerData"></Banner>
      <VideoList :channelId="channelId" :key="item.id" v-for="(item, index) in legoChannels" :videoData="item"></VideoList>
    </template>
    <template v-if="showError">
      <LoadError></LoadError>
    </template>
  </div>
</template>

<script>
import parseUrl from 'url-parse';
import VideoList from '../components/channelVideoList/ChannelVideoList.vue';
import SingleVideo from '../components/singleVideo/SingleVideo.vue';
import ToTopBar from '../components/toTopBar/ToTopBar.vue';
import Banner from '../components/banner/Banner.vue';
import LoadError from '../components/loadError/LoadError.vue';
import { getQuery } from '../util';

export default {
    name: 'channel-view',
    components: {
        VideoList,
        SingleVideo,
        ToTopBar,
        LoadError,
        Banner,
    },

    props: ['channelId'],

    data () {
        return {
            channelData: {},
            legoChannels: [],
            show: false,
            scrollTopDistance: 0,
            pageNo: 1,
            page: 1,
            needToGet: true,
            showError: false,
            bannerData: [],
      // videoBaseId: [],
            linkSrc: '',
        };
    },

    mounted () {
        let _this = this;
        this.getBannerList(this.channelId);
        this.getChannelList(this.channelId);
        document.addEventListener('scroll', () => {
            let height = document.body.scrollHeight || document.documentElement.scrollHeight;
            _this.scrollTopDistance = document.documentElement.scrollTop || document.body.scrollTop;
            if (_this.scrollTopDistance + document.body.offsetHeight + 1000 >= height) {
                if (_this.needToGet) {
                    _this.pageNo++;
                    _this.needToGet = false;
                    _this.axios.post('/m_web/lego/channel', {
                        channelId: _this.channelId,
                        pageNo: _this.pageNo,
                    }).then(res => {
                        if (res.code === 0) {
                            res.data.legoChannels.forEach(item => {
                                if (item.layoutId !== 6 && item.layoutId !== 7) {
                                    _this.legoChannels.push(item);
                                }
                            });
                            _this.needToGet = true;
                            if (res.data.pager.lastPage) {
                                _this.needToGet = false;
                            }
                        } else {
                        }
                    });
                }
            }
        });
    },

    watch: {
        channelId (val, oldVal) {
            this.isGet = false;
            if (val !== oldVal) {
                this.needToGet = true;
                this.bannerData = [];
                this.videoBaseId = [];
                this.getBannerList(val);
                this.getChannelList(val);
                this.pageNo = 1;
            }
        }
    },

    methods: {
        getBannerList (channelId) {
            this.axios.post('/m_web/banner', {
                channelId
            }).then((res) => {
                if (res.code === 0) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].schemeUrl.substring(0, 4) !== 'http') {
                            let url = parseUrl(res.data[i].schemeUrl, {});
                            let action = getQuery('action', url.query);
                            if (action === 'videoPlay') {
                                this.bannerData.push({
                                    ...res.data[i],
                                    videoBaseId: getQuery('videoId', url.query)
                                });
                            } else if (action === 'webView') {
                                this.bannerData.push({
                                    ...res.data[i],
                                    httpLink: true,
                                    schemeUrl: getQuery('url', url.query)
                                });
                            } else if (action === 'livePlay') {
                                this.bannerData.push({
                                    ...res.data[i],
                                    roomId: getQuery('id', url.query),
                                    liveLink: true
                                });
                            }
                        } else {
                            this.bannerData.push({
                                ...res.data[i],
                                httpLink: true
                            });
                        }
                    }
                }
            }).catch((err) => {
                console.error(err);
            });
        },
        getChannelList (channelId, pageNo = 1) {
            this.needToGet = false;
            this.axios.post('/m_web/lego/channel', {
                channelId,
                pageNo,
            }).then(res => {
                if (res.code === 0) {
                    this.channelData = res.data;
                    let channels = [];
                    res.data.legoChannels.forEach(item => {
                        if (item.layoutId !== 6 && item.layoutId !== 7) {
                            channels.push(item);
                        }
                    });
                    this.legoChannels = channels;
                    res.data.legoChannels.length === 0 ? this.showError = true : this.showError = false;
                    this.needToGet = true;
                    if (res.data.pager.lastPage) {
                        this.needToGet = false;
                    }
                } else {
                }
            });
        },
    }
};
</script>

<style scoped>

.slide-fade-enter-active {
  transition: all .5s ease;
}

.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1, .5, .8, 1);
}

.slide-fade-leave-active {
  transform: translateX(-500%);
  opacity: 0;
}
</style>
