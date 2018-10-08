<template>
  <div class="video-player" :style="{position: 'relative'}">
    <video style="width: 100%; height: 100%;" :class="{'move-right': isMoveRight}" class="video-js vjs-melephant" playsinline="playsinline"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import { jump } from '../../util/jump.js';
require('../../lib/videojs-resolution-switcher');
import '../../lib/videojs-resolution-switcher.css';
export default {
    name: 'video-player',

    data () {
        return {
            player: null,
        };
    },

    props: {
        options: {
            type: Object,
            required: true,
        },
        isEnded: {
            type: Boolean,
            default: true,
        },
        isMoveRight: {
            type: Boolean,
            default: false,
        },
        hideDownload: {
            type: Boolean,
            default: false
        }
    },

    mounted() {
    },

    methods: {
        gotoDownload() {
            jump.linkAppVideo(this.options.videoBaseId, this.options.videoDetailId);
        },
        buildErrorModal(player) {
            let modal = videojs.getComponent('ClickableComponent');
            let theComponent = videojs.extend(modal, {
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
            videojs.registerComponent('ErrorDisplay', theComponent);
        },
        buildLoadingSpinner() {
            let loadingComponent = videojs.getComponent('LoadingSpinner');
            let Loading = videojs.extend(loadingComponent, {
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
                        className: 'vjs-m-fullscreen vjs-melephant-loading vjs-hidden'
                    });
                },
            });
            videojs.registerComponent('Loading', Loading);
        },
        buildModalComp() {
            if (this.hideDownload) {
                return;
            }
            let that = this;
            let modal = videojs.getComponent('ClickableComponent');
            let theComponent = videojs.extend(modal, {
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
            videojs.registerComponent('EndDisplay', theComponent);
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
                width: options.width || document.body.offsetWidth,
                height: options.height || document.body.offsetWidth * 9 / 16,
                poster: options.poster || '', // 海报
                techOrder: ['html5', 'flash'],
                controlBar,
                errorDisplay: false, // 使用自定义错误框
                loadingSpinner: false, // 使用自定义错误框
            };
            // 短视频
            if (options.videoBaseId === undefined) {
                videoOption.sources = options.sources || [];
            } else { // 点播
                videoOption.plugins = {
                    videoJsResolutionSwitcher: {
                        ui: true,
                        default: 480,
                        dynamicLabel: true
                    }
                };
            }
            this.player = null;
            this.player = videojs(document.querySelector('.video-js'), videoOption, function() {
                theComponent.buildLoadingSpinner();
                theComponent.buildErrorModal(this);
                theComponent.buildModalComp();

                this.addChild('Loading');
                this.addChild('ErrorDisplay');
                // 点播结束时才需要app下载提示，通过videoBaseId来判断是短视频和点播视频
                options.videoBaseId && this.addChild('EndDisplay');
                this.on('loadedmetadata', () => {
                });

                this.on('seeked', () => {
                    this.childNameIndex_.Loading.hide();
                });

                this.on('error', () => {
                    this.childNameIndex_.ErrorDisplay.show();
                    options.videoBaseId && this.childNameIndex_.EndDisplay.hide();
                });

                this.on('seeking', () => {
                    this.childNameIndex_.Loading.show();
                });
                this.on('waiting', () => {
                    this.childNameIndex_.Loading.show();
                });

                this.on('play', () => {
                    this.childNameIndex_.ErrorDisplay.hide();
                    options.videoBaseId && this.childNameIndex_.EndDisplay.hide();
                });

                this.on('ended', () => {
                    if (theComponent.isEnded) {
                        options.videoBaseId && this.childNameIndex_.EndDisplay.show();
                        this.controls(true);
                    } else {
                        theComponent.$emit('onNextVideo');
                    }
                });

                this.on('fullscreenchange', (screen) => {
                    if (!this.isFullscreen()) {
                        this.childNameIndex_.ErrorDisplay.hide();
                        options.videoBaseId && this.childNameIndex_.EndDisplay.hide();
                        this.controls(true);
                    }
                });

                this.on('canplay', () => {
                    this.childNameIndex_.Loading.hide();
                });
                if (options.videoBaseId !== undefined) {
                    let player = this;
                    window.player = player;
                    const sources = options.sources.slice(0);
                    player.updateSrc(sources);
                    player.on('resolutionchange', function() {
                        console.info('Source changed to %s', player.src());
                    });
                }
            });
        },
    },
    watch: {
        'options.sources': {
            handler: function(newSources, oldSources) {
                if (!this.player) {
                    this.init();
                } else {
                    this.dispose();
                    this.init();
                }
            },
            deep: true
        }
    }
};

</script>

<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.video-js {
  width: 100%;
  height: 100%;
}

.move-right {
  position: absolute;
  width: 3.75rem;
  left: 0;
}
</style>
