<template>
  <div class="index">
    <div class="suspension-wrap">
      <LogoBannner :isShowSuggest="showSuggest"></LogoBannner>
      <Navigation id="navigation" :channels="channels"></Navigation>
    </div>
    <ChannelView
      :style="{ paddingTop: distance + 'rem'}"
      class="channelView"
      :channelId="currentChannelId"
    >
    </ChannelView>
    <ToTopBar v-if="toTopBarVisible"></ToTopBar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LogoBannner from '../components/LogoBanner.vue';
import Navigation from '../components/navigation/Navigation.vue';
import Banner from '../components/banner/Banner.vue';
import ChannelView from './ChannelView.vue';
import ToTopBar from '../components/toTopBar/ToTopBar.vue';
import titleMixin from '../mixins/title-mixin';
import { wxShare } from '../util/wxShare.js';

export default {
    name: 'home',
    components: {
        LogoBannner,
        Navigation,
        Banner,
        ChannelView,
        ToTopBar
    },

    mixins: [titleMixin],

    title () {
        return '有象视频';
    },
    data () {
        return {
            showSuggest: true,
            scrollThreshold: 270,
            toTopBarVisible: false,
            bannerData: [],
            isSuspension: false,
            distance: 0.955,
        };
    },

    asyncData({ store }) {
        return store.dispatch('FETCH_CHANNEL', {});
    },
    mounted () {
        if (this.$route.path === '/index') {
            this.$router.push({ name: 'Index', params: { channelId: 0 }});
        }
        this.toTopInit();
        let defaultShare = 'https://image.youxiang0210.com/wechat-share.png';
        wxShare('有象视频', '看剧追片，有象就够', defaultShare);
    },
    updated () {
        this.toTopInit();
    },
    computed: {
        currentChannelId () {
            if (this.$route.params.channelId) {
                return this.$route.params.channelId;
            } else {
                return this.channelIdArr[0];
            }
        },
        currentChannelIdIndex () {
            return this.channelIdArr.indexOf(+this.currentChannelId);
        },
        ...mapState({
            channels: state => {
                return state.channels;
            },
            banner: state => {
                return state.banner;
            },
            channelIdArr: state => {
                return state.channelIdArr;
            }
        })
    },
    methods: {
        toTopInit () {
            let _this = this;
            window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', _this.orientationchange, false);
            document.addEventListener('scroll', () => {
                _this.scrollTopDistance = document.documentElement.scrollTop || document.body.scrollTop;
                if (_this.scrollTopDistance >= _this.scrollThreshold) {
                    _this.toTopBarVisible = true;
                } else {
                    _this.toTopBarVisible = false;
                }
            });
        },
        orientationchange () {
            const orientation = window.orientation;
            setTimeout(() => {
                if (orientation === 90 || orientation === -90) {
                    this.scrollThreshold = 270;
                } else {
                    this.scrollThreshold = 470;
                }
            }, 1000);
        }
    }
};
</script>

<style scoped>

.suspension-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>
