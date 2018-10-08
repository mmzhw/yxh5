<template>
<div class="wrap">
  <div class="header">
    <div class="logo">
      <a href="/">
        <img src="../assets/common/logo0.png" alt="">
      </a>
    </div>
    <div class="btn-box">
      <a href="javascript:void(0)" class='btn open' @click='gotoDownload'>APP内打开</a>
      <a href="javascript:void(0)" class='btn download' @click='gotoDownload'>下载APP</a>
    </div>
  </div>
  <div class="play-wrap" v-show='!((liveStatus == 1 && warmUpVideoList.length === 0) || (liveStatus == 2 && (playbackUrl == "" || result.playbackStatus == 0)))'>
    <video :class="['video-js', 'vjs-melephant']" playsinline="playsinline"></video>
    <div class='status-logo status-ing' v-if='liveStatus === 0'>
      <i></i>
      直播中
    </div>
    <div class='status-logo status-done' v-if='liveStatus === 2 && !(playbackUrl == "" || result.playbackStatus == 0)'>
      <i></i>
      回放
    </div>
    <div class="people">
      {{ text }}
    </div>
  </div>
  <div class='poster' v-show='(liveStatus == 1 && warmUpVideoList.length === 0) || (liveStatus == 2 && (playbackUrl == "" || result.playbackStatus == 0))'>
    <div class="done" v-show='liveStatus == 2 && (playbackUrl == "" || result.playbackStatus == 0)'>
      当前直播已结束
    </div>
    <img :src="`http://dx-image-test.itangchao.me/${result.displayImageUrl}`" :class='[(liveStatus == 2 && (playbackUrl == "" || result.playbackStatus == 0)) ? "cover": ""]'>
    <div class="people">
      {{text}}
    </div>
  </div>
  <div :class='["status", status >= 4 ? "status-ready" : ""]'>
    <template v-if='status < 4'>
      <h1>{{result.title}}</h1>
      <div class="sub-title">
        {{ status == 1 ? "直播准备中" : "距离直播还有" }}
      </div>
      <div class="clock">
        <div class="days  block">{{time.days}}天</div>
        <div class="hours block">{{time.hours}}</div>
        <div class="mins block">{{time.mins}}</div>
        <div class="secs block">{{time.secs}}</div>
      </div>
    </template>
    <template v-else>
      <h1>{{result.title}}</h1>
      <span class='sub'>开始时间：{{fmtTime(timeLeft)}}</span>
    </template>
  </div>
  <div class="activity">
    <div class="details">
      <h2>活动详情</h2>
      <p>{{result.detail}}</p>
    </div>
    <div class="details">
      <h2>活动地点</h2>
      <p>{{result.location}}</p>
    </div>
    <div class="details">
      <h2>主办单位</h2>
      <p>{{result.organizer}}</p>
    </div>
    <div class="details">
      <h2>合作单位</h2>
      <p>{{result.partner}}</p>
    </div>
  </div>
</div>
</template>

<script>
// import videojs from 'video.js'
import { wxShare } from '../util/wxShare.js'
import { imageUrl } from '../util/index.js'

export default {
  name: 'e-live',

  data() {
    return {
      liveRoomId: '',
      vOptions: {
        autoplay: true,
        sources: [],
        controls: true,
        height: '423',
        poster: '',
      },
      liveStatus: -1, // 1，即将开始，0，直播中，2直播结束
      warmUpVideoList: [],
      currentWarmUpVideoIndex: 0,
      playbackUrl: '',
      timeLeft: Date.now(),
      result: {
        displayImageUrl: '',
        playbackStatus: 0
      },
      time: {
        days: '00',
        hours: '00',
        mins: '00',
        secs: '00'
      },
      record: {},
    }
  },

  computed: {
    status() {
      let status

      if (this.liveStatus === 2) {
        status = 5 // 直播结束
      } else if (this.liveStatus === 0) {
        status = 4 // 1.时间已到，直播中2.时间未到直播已经提前开始
      } else if (this.liveStatus === 1 && this.warmUpVideoList.length !== 0 && this.timeLeft - Date.now() > 0) {
        status = 3 // 直播未开始，有预播影片
      } else if (this.liveStatus === 1 && this.timeLeft - Date.now() <= 0) {
        status = 1 // 时间已到，直播未开始
      } else if (this.liveStatus === 1 && this.warmUpVideoList.length === 0) {
        status = 2 // 直播未开始，无预播影片
      }
      return status
    },
    text() {
      if (this.liveStatus === 1) {
        return `${this.record.interested}人想看`
      } else if (this.liveStatus === 0) {
        return `${this.record.watching}人正在观看`
      } else if (this.liveStatus === 2) {
        return `${this.record.watched}人已看`
      }
    }
  },

  created() {
    const liveRoomId = this.$route.params.roomId
    this.liveRoomId = liveRoomId
    Promise.all([
      this.axios.post('/m_web/liveRoom/view', { liveRoomId }),
      this.axios.post('/m_web/liveRoom/warmUpVideoList', { liveRoomId }),
      this.axios.post('/m_web/liveRoom/getRecordByLiveRoomId', { liveRoomId })
    ]).then((result) => {
      if (result[0].code !== 0) return
      this.handleRoomDetail(result[0].data)
      this.handleWarmUpVideos(result[1].data)
      this.handleRecord(result[2].data)
      if (!((this.liveStatus === 1 && this.warmUpVideoList.length === 0) || (this.liveStatus === 2 && this.playbackUrl === ''))) {
        this.init() // 1.直播或者直播后，2.直播未开始但是有预热视频
      }
      let defaultShare = 'https://image.youxiang0210.com/wechat-share.png'
      wxShare(result[0].data.title, result[0].data.shareSubTitle, (imageUrl + result[0].data.displayImageUrl || defaultShare))
    })
  },

  methods: {
    handleRecord(data) {
      this.record = data
    },
    handleRoomDetail(data) {
      const result = data
      this.result = result
      document.title = this.result.title
      this.liveStatus = result.liveStatus
      this.timeLeft = result.scheduleTime
      this.playbackUrl = result.playbackUrl
      if (this.liveStatus === 0) { // 直播中才开始播放直播视频
        this.vOptions.sources.push({
          src: result.hlsPlayUrl,
          type: 'application/x-mpegURL'
        })
      }
      if (this.liveStatus === 2 && this.playbackUrl !== null) { // 已经结束放回放
        this.vOptions.sources.push({
          src: this.playbackUrl,
          type: 'application/x-mpegURL'
        })
      }
      this.vOptions.poster = `http://dx-image-test.itangchao.me/${result.displayImageUrl}`
      if (Date.now() < this.timeLeft && this.liveStatus === 1) { // 时间还没到才开始倒计时
        this.refreshTime()
      }
    },
    fmtTime(timeStamp) {
      const date = new Date(timeStamp)

      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const mins = date.getMinutes()
      const secs = date.getSeconds()

      return `${year}-${this.fixNum(month)}-${this.fixNum(day)}  ${this.fixNum(hour)}:${this.fixNum(mins)}:${this.fixNum(secs)}`
    },
    handleWarmUpVideos(data) {
      const result = data
      for (let i = 0; i < result.length; i++) {
        const item = result[i].vVideoDetailRspVos
        for (let j = 0; j < item.length; j++) {
          this.warmUpVideoList.push(`https://video.youxiang0210.com/${item[j].videoResourceStatusVo.m3u8Clarity.url}`)
        }
      }

      if (this.warmUpVideoList.length !== 0 && this.liveStatus === 1) {
        this.vOptions.sources.push({
          src: this.warmUpVideoList[0],
          type: 'application/x-mpegURL'
        })
        this.currentWarmUpVideoIndex = 0
      }
    },
    gotoDownload() {
      // let ifr = document.createElement('iframe')
      // ifr.src = 'com.daxiang.live://go?action=videoPlay&videoId=10000128&videoDetailId=800000123'
      // ifr.style.display = 'none'
      // document.body.appendChild(ifr)
      // location.href = 'https://fir.im/liveIOS'

      // setTimeout(() => {
      //   document.body.removeChild(ifr)
      // }, 2000)

      location.href = 'jcgroup://youxiang.com/go?action=livePlay&id=' + this.liveRoomId
      const now = Date.now()
      setTimeout(() => {
        if (Date.now() - now < 1550) {
//          location.href = 'https://www.youxiang0210.com/m-index.html'
          this.$router.replace({
            name: 'download'
          })
        }
      }, 1500)
    },
    refreshTime() {
      this.tid = setInterval(() => {
        this.time = this.countdown()
      }, 1000)
    },
    fixNum(num) {
      if (num > 9) {
        return num
      } else {
        return `0${num}`
      }
    },
    countdown() {
      const now = Date.now()
      if (now > this.timeLeft) {
        clearInterval(this.tid)
        return {
          days: '00',
          hours: '00',
          mins: '00',
          secs: '00'
        }
      }
      const timeLag = Math.floor((this.timeLeft - now) / 1000)

      const time = {
        days: this.fixNum(Math.floor(timeLag / 86400)),
        hours: this.fixNum(Math.floor((timeLag / 3600) % 24)),
        mins: this.fixNum(Math.floor((timeLag / 60) % 60)),
        secs: this.fixNum(Math.floor((timeLag % 60)))
      }

      return time
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
      }
      var that = this

      const options = this.vOptions
      options.width = document.body.offsetWidth
      const theComponent = this
      let videoOpiton = {
        controls: options.controls, // 控制按钮
        autoplay: false, // 自动播放
        width: document.body.offsetWidth || options.width,
        height: options.height,
        poster: options.poster || '', // 海报
        techOrder: ['html5', 'flash'],
        sources: options.sources || [],
        controlBar,
        errorDisplay: false, // 使用自定义错误框
        loadingSpinner: false, // 使用自定义错误框
      }

      this.player = null
      this.player = videojs(document.querySelector('.video-js'), videoOpiton, function() {
        theComponent.buildLoadingSpinner()
        theComponent.buildErrorModal(this)
        theComponent.buildModalComp()

        this.addChild('Loading')
        this.addChild('ErrorDisplay')
        this.addChild('EndDisplay')

        this.on('error', () => {
          this.childNameIndex_.ErrorDisplay.show()
          this.childNameIndex_.Loading.hide()
          this.childNameIndex_.EndDisplay.hide()
        })

        this.on('seeking', () => {
          this.childNameIndex_.Loading.show()
        })
        this.on('waiting', () => {
          this.childNameIndex_.Loading.show()
        })

        this.on('play', () => {
          this.childNameIndex_.ErrorDisplay.hide()
          this.childNameIndex_.Loading.hide()
          this.childNameIndex_.EndDisplay.hide()
        })

        this.on('ended', () => {
          if (that.currentWarmUpVideoIndex + 1 < that.warmUpVideoList.length) {
            that.currentWarmUpVideoIndex = that.currentWarmUpVideoIndex + 1
            this.src({
              src: that.warmUpVideoList[that.currentWarmUpVideoIndex],
              type: 'application/x-mpegURL'
            })
          } else {
            that.currentWarmUpVideoIndex = 0
            this.src({
              src: that.warmUpVideoList[that.currentWarmUpVideoIndex],
              type: 'application/x-mpegURL'
            })
          }
        })

        this.on('fullscreenchange', (screen) => {
          if (!this.isFullscreen()) {
            this.childNameIndex_.ErrorDisplay.hide()
            this.childNameIndex_.Loading.hide()
            this.childNameIndex_.EndDisplay.hide()
            this.controls(true)
          }
        })

        // loading
        const loadingHideList = ['playing', 'canplay']
        for (let i = 0, j = loadingHideList.length; i < j; i++) {
          this.on(loadingHideList[i], () => {
            this.childNameIndex_.Loading.hide()
          })
        }
      })
      window.addEventListener('resize', () => {
        this.player.width(document.body.offsetWidth)
      })
    },
    buildLoadingSpinner() {
      let loadingComponent = videojs.getComponent('LoadingSpinner')
      let Loading = videojs.extend(loadingComponent, {
        constructor: function(player, options) {
          loadingComponent.apply(this, arguments)
        },
        createEl() {
          return videojs.createEl('div', {
            innerHTML: `
              <div class="content-wrap">
                <img class="loading-gif" src="${require('../assets/common/loading.gif')}" alt="">
              </div>
            `,
            className: 'vjs-m-fullscreen vjs-melephant-loading vjs-hidden'
          })
        },
      })
      videojs.registerComponent('Loading', Loading)
    },
    buildErrorModal(player) {
      // let that = this
      let modal = videojs.getComponent('ClickableComponent')
      let theComponent = videojs.extend(modal, {
        name() {
          return 'ErrorDisplay'
        },
        constructor: function(player, options) {
          modal.apply(this, arguments)
        },
        createEl() {
          return videojs.createEl('div', {
            innerHTML: `
              <div class="content-wrap">
                <p class="error-text">视频加载失败</p>
                <p class="error-reload"><i class="iconfont icon-refresh"></i>刷新重试</p>
              </div>
            `,
            className: 'vjs-m-fullscreen vjs-melephant-error vjs-hidden'
          })
        },
        handleClick() {
          // console.log(that)
          // that.dispose()
          // that.init()
          // player.play()
          location.reload()
        }
      })
      videojs.registerComponent('ErrorDisplay', theComponent)
    },
    dispose() {
      this.player.dispose()
      const videoEl = document.createElement('video')
      videoEl.setAttribute('class', 'video-js vjs-melephant')
      videoEl.setAttribute('playsinline', 'playsinline')
      document.querySelector('.play-wrap').appendChild(videoEl)
    },
    buildModalComp() {
      let that = this
      let modal = videojs.getComponent('ClickableComponent')
      let theComponent = videojs.extend(modal, {
        name() {
          return 'EndDisplay'
        },
        constructor: function(player, options) {
          modal.apply(this, arguments)
        },
        createEl() {
          return videojs.createEl('div', {
            innerHTML: `
              <div class="content-wrap">
                <i class="iconfont icon-download2"></i>
                <span class="end-text">点击下载有象app</span>
              </div>
            `,
            className: 'vjs-m-fullscreen vjs-melephant-ended vjs-hidden'
          })
        },
        handleClick() {
          that.gotoDownload()
        }
      })
      videojs.registerComponent('EndDisplay', theComponent)
    },
  }
}
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

.video-js {
  height: 2.12rem;
  width: 100%;
}

.wrap {
  .header {
    width: 100%;
    background: #0A0A0A;
    height: .5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    margin-left: .1rem;
    height: .3rem;
    a {
      display: block;
    }
    img {
      height: .3rem;
    }
  }
  .btn-box {
    height: .3rem;
    display: flex;
    margin-right: .1rem;
  }
  .btn {
    font-size: 13px;
    box-sizing: border-box;
    display: block;
    width: .9rem;
    height: .3rem;
    line-height: .3rem;
    text-align: center;
    border-radius: .04rem;
  }
  .open {
    color: #FABE00;
    border: 1px solid rgba(250, 190, 0, .5);
  }
  .download {
    margin-left: .1rem;
    background: #FABE00;
    color: #FFF;
    font-weight: 500;
  }
  .play-wrap {
    overflow: hidden;
    background: #000;
    height: 2.12rem;
    user-select: none;
    box-shadow: 0 -200px 150px 100px #000;
  }
  .status-logo {
    padding: 5px 10px;
    border-radius: 6px;
    background: rgba(0, 0, 0, .2);
    position: absolute;
    color: #FFF;
    font-size: 11px;
    top: .55rem;
    left: .2rem;
    i {
      height: 8px;
      width: 12px;
      display: inline-block;
    }
  }
  .status-ing {
    i {
      background-image: url('../assets/live/ing.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .status-done {
    i {
      background-image: url('../assets/live/done.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .people {
    position: absolute;
    right: .05rem;
    top: .55rem;
    padding: 5px 8px;
    color: #FFF;
    font-size: 11px;
  }
  .done {
    position: absolute;
    top: 1.3rem;
    left: 50%;
    color: #FABE00;
    width: 100px;
    margin-left: -50px;
    text-align: center;
    z-index: 9;
  }
  .cover {
    opacity: .5;
  }
  .poster {
    background: #000;
    height: 2.12rem;
    user-select: none;
    box-shadow: 0 -200px 150px 100px #000;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .status {
    text-align: center;
    padding-bottom: .3rem;

    &.status-ready {
      padding: .1rem;
      text-align: left;

      h1 {
        justify-content: flex-start;
        text-align: left;
        margin: 0;
        font-size: 20px;
        margin-bottom: 8px;
      }
      .sub {
        font-size: 14px;
        color: #D2B685;
        letter-spacing: 1px;
      }
    }
    h1 {
      display: flex;
      justify-content: center;
      text-align: center;
      font-size: 22px;
      color: #222;
      letter-spacing: 1px;
      margin: 20px auto 0;
    }
  }
  .sub-title {
    justify-content: center;
    display: flex;
    text-align: center;
    width: 2.2rem;
    font-weight: 500;
    margin: .1rem auto 0;
    font-size: 15px;
    color: #BF9751;
    letter-spacing: 1px;
    opacity: .7;
    background-image: url('../assets/live/line.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .clock {
    background-image: url('../assets/live/clock.png');
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    height: .56rem;
    width: 2.55rem;
    margin: 24px auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .block {
    background: #D5A85A;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    color: #FFF;
    height: .4rem;
    line-height: .4rem;
    text-align: center;
    width: .36rem;
    margin: 0 .085rem;
  }
  .days {
    width: .53rem;
  }
  .activity {
    box-sizing: border-box;
    margin: 0 auto;
    padding: 20px 10px;
    border-top: 1px solid #EEE;
    width: 94.666666%;
  }
  .details {
    margin-bottom: .1rem;
    h2 {
      font-size: 15px;
      color: #4A4A4A;
      letter-spacing: .54px;
    }
    p {
      opacity: .8;
      margin-top: .075rem;
      font-size: 14px;
      color: #555;
      letter-spacing: 1px;
      line-height: .25rem;
    }
  }
}
</style>
