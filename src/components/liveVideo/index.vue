<template>
  <div class="video-player">
    <video style="width: 100%;height: 100%;" :class="['video-js', 'vjs-melephant']" playsinline="playsinline" webkit-playsinline></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import { jump } from '../../util/jump.js';

export default {
    name: 'live-player',

    data () {
        return {
            videojs: null,
            player: null,
        };
    },
    props: {
        goplay: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Object,
            required: true,
        },
        isEnded: {
            type: Boolean,
            default: true,
        },
    },

    mounted() {
        this.videojs = window.videojs;
        this.init();
    },
    methods: {
        gotoDownload() {
            jump.linkAppVideo(this.options.videoBaseId, this.options.videoDetailId);
        },
        buildErrorModal(player) {
            let modal = this.videojs.getComponent('ClickableComponent');
            let theComponent = this.videojs.extend(modal, {
                name() {
                    return 'ErrorDisplay';
                },
                constructor: function(player, options) {
                    modal.apply(this, arguments);
                },
                createEl() {
                    return videojs.createEl('div', {
                        innerHTML: `
              <div class="content-wrap">
                <p class="error-text">加载失败，请检查网络设置</p>
                <p class="error-reload"><i class="iconfont icon-refresh"></i>刷新重试</p>
              </div>
            `,
                        className: 'vjs-m-fullscreen vjs-melephant-error vjs-hidden'
                    });
                },
                handleClick() {
                    player.load();
                    player.play();
                }
            });
            this.videojs.registerComponent('ErrorDisplay', theComponent);
        },
        buildLoadingSpinner() {
            let loadingComponent = this.videojs.getComponent('LoadingSpinner');
            let Loading = this.videojs.extend(loadingComponent, {
                constructor: function(player, options) {
                    loadingComponent.apply(this, arguments);
                },
                createEl() {
                    return videojs.createEl('div', {
                        innerHTML: `
              <div class="content-wrap">
                <img class="loading-gif" src="${require('../../assets/play/loading.gif')}" alt="">
                <p>加载中</p>
              </div>
            `,
                        className: 'vjs-m-fullscreen vjs-melephant-loading vjs-hidden',
                        style: 'top: -1rem'
                    });
                },
            });
            this.videojs.registerComponent('Loading', Loading);
        },
        buildModalComp() {
            let that = this;
            let modal = this.videojs.getComponent('ClickableComponent');
            let theComponent = this.videojs.extend(modal, {
                name() {
                    return 'EndDisplay';
                },
                constructor: function(player, options) {
                    modal.apply(this, arguments);
                },
                createEl() {
                    return videojs.createEl('div', {
                        innerHTML: `
              <div class="content-wrap">
                <span class="end-text">视频播放已结束<br>下载APP观看更多视频</span>
                <p class="end-link">下载有象视频<i class="iconfont icon-download2"></i></p>
              </div>
            `,
                        className: 'vjs-m-fullscreen vjs-melephant-ended vjs-hidden'
                    });
                },
                handleClick() {
                    that.gotoDownload();
                }
            });
            this.videojs.registerComponent('EndDisplay', theComponent);
        },
        dispose() {
            this.player.dispose();
            const videoEl = document.createElement('video');
            videoEl.setAttribute('class', 'video-js vjs-melephant');
            videoEl.setAttribute('playsinline', 'playsinline');
            document.querySelector('.video-player').appendChild(videoEl);
        },
        init() {
            let controlBar = {
                children: [
                    'playToggle',
                    'currentTimeDisplay',
                    'progressControl',
                    'durationDisplay',
                    'fullscreenToggle',
                ]
            };
            const options = this.options;
            const theComponent = this;
            let videoOption = {
                controls: options.controls, // 控制按钮
                autoplay: options.autoplay || false, // 自动播放
                responsive: true,
                fluid: true,
                loop: true,
                poster: options.poster || '', // 海报
                techOrder: ['html5', 'flash'],
                sources: options.sources || [],
                controlBar,
                errorDisplay: false, // 使用自定义错误框
                loadingSpinner: false, // 使用自定义错误框
            };
            this.player = null;
            this.player = this.videojs(document.querySelector('.video-js'), videoOption, function() {
                theComponent.buildLoadingSpinner();
                theComponent.buildErrorModal(this);
                theComponent.buildModalComp();

                this.addChild('Loading');
                this.addChild('ErrorDisplay');
                this.addChild('EndDisplay');

                this.on('loadedmetadata', () => {
          // this.childNameIndex_.Loading.hide()
                });

                this.on('seeked', () => {
                    this.childNameIndex_.Loading.hide();
                });

                this.on('error', () => {
                    this.childNameIndex_.ErrorDisplay.show();
                    this.childNameIndex_.Loading.hide();
                    this.childNameIndex_.EndDisplay.hide();
                });

                this.on('seeking', () => {
                    this.childNameIndex_.Loading.show();
                });
                this.on('waiting', () => {
                    this.childNameIndex_.Loading.show();
                });

                this.on('play', () => {
                    this.childNameIndex_.ErrorDisplay.hide();
          // this.childNameIndex_.Loading.hide()
                    this.childNameIndex_.EndDisplay.hide();
                });

                this.on('ended', () => {
                    if (theComponent.isEnded) {
                        this.childNameIndex_.EndDisplay.show();
                        this.controls(false);
                    } else {
                        theComponent.$emit('onNextVideo');
                    }
                });

                this.on('fullscreenchange', (screen) => {
                    if (!this.isFullscreen()) {
                        this.childNameIndex_.ErrorDisplay.hide();
            // this.childNameIndex_.Loading.hide()
                        this.childNameIndex_.EndDisplay.hide();
                        this.controls(true);
                    }
                });

                this.on('canplay', () => {
                    this.childNameIndex_.Loading.hide();
                });
            });
        },
    },
    watch: {
        'options': {
            handler: function(newSources, oldSources) {
                if (!this.player) {
                    this.init();
                } else {
                    this.dispose();
                    this.init();
                }
            },
            deep: true
        },
        'goplay': {
            handler: function() {
                setTimeout(() => {
                    this.player.play();
                }, 500);
            }
        }
    }
};

</script>

<style scope>
.vjs-live .vjs-progress-control {
  display: block !important;
  visibility: hidden;
}

.vjs-live .vjs-duration {
  visibility: hidden;
  width: 1.5rem !important;
}

.vjs-live .vjs-current-time-display {
  visibility: hidden;
}

.vjs .vjs-duration-display {
  display: none;
}
</style>

