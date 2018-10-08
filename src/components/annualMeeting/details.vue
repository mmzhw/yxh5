<template>
  <div class="summary-box">
    <div class="headerImg" style="position: relative;z-index: 1;">
      <img v-if="imageBannerUrl" :src="imageUrl + imageBannerUrl" class="summary-header-img">
      <div class="imgcover" style="position: absolute;top:0;z-index: 10;width: 100%;height: 100%;"></div>
    </div>
    <div @click="backToRight" class="back-to-right" style="position: absolute; top:.1rem;left: 0;z-index: 5;">
      <img src="../../../public/annualMeeting/img_mulu.png" style="width: .6rem;">
    </div>
    <ul>
      <li v-for="(item, i) in list" :key="i"
          class="summary-item-list"
          :class="{'left': i % 2 === 0, 'right': i % 2 === 1, 'first': i === 0, 'last': (i === list.length - 1) && (i !== 0) }"
      >
        <dl>
          <template v-if="i % 2 === 0">
            <dd>
              <div class="container">
                <img :src="imageUrl + item.imageUrl">
                <div class="date">{{dateParse(item.scheduleTime)}}</div>
              </div>
              <div class="play-icon" v-if="item.videoId" @click="summaryPlay(item.videoId)">
                <span class="iconfont icon-play"></span>
              </div>
              <div class="mask"></div>
            </dd>
            <dt>
              <p class="title">{{item.name}}</p>
              <div class="intro">
                {{item.subName}}
              </div>
            </dt>
          </template>
          <template v-else>
            <dt>
              <p class="title" style="text-align: right">{{item.name}}</p>
              <div class="intro">
                {{item.subName}}
              </div>
            </dt>
            <dd>
              <div class="container">
                <img :src="imageUrl + item.imageUrl">
                <div class="date">{{dateParse(item.scheduleTime)}}</div>
              </div>
              <div class="play-icon" v-if="item.videoId" @click="summaryPlay(item.videoId)">
                <span class="iconfont icon-play"></span>
              </div>
              <div class="mask"></div>
            </dd>
          </template>
        </dl>
        <div class="bottom-line" v-if="(list.length === 1) || (i !== list.length - 1)"></div>
      </li>
    </ul>
  </div>
</template>
<script>
import { imageUrl, videoUrl } from '../../util/index.js';

export default {
    name: 'annual-meeting-detail',
    props: ['data'],
    data () {
        return {
            list: [],
            imageUrl: imageUrl,
            videoUrl: videoUrl,
            imageBannerUrl: null,
            vOptions: {
                sources: [],
                controls: true,
                poster: '',
            },
        };
    },
    methods: {
        _forEach (arr, pushArr) {
            arr.forEach(item => {
                if (item.length > 0) {
                    this._forEach(item, pushArr);
                } else {
                    pushArr.push(item);
                }
            });
        },
        summaryPlay (vId) {
            this.$emit('getSources', vId);
        },
        dateParse (time) {
            let month = new Date(time).getMonth() + 1;
            let day = new Date(time).getDate();
            return `${month}月${day}日`;
        },
        backToRight () {
            this.$emit('back');
        }
    },
    created () {
        this.imageBannerUrl = this.data.imageBannerUrl;
        this._forEach(this.data.mdata.videos, this.list);
    },
};
</script>
<style scoped>
.summary-header-img {
  width: 100%;
}

.summary-box {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #FFF;
  z-index: 100;
  &.show {
    display: block;
  }
  &.hide {
    display: none;
  }
}

.summary-item-list {
  height: .9rem;
  margin-top: .01rem;
  padding: 0 .1rem;
  & > .bottom-line {
    width: 2.55rem;
    border-bottom: .01rem solid #E0C294;
    position: relative;
    left: 50%;
    top: .01rem;
    transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0);
    -moz-transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
  }
  &:first-child {
    margin-top: .1rem;
  }
  & > dl {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    height: .9rem;
    -webkit-flex-direction: row;
    color: #000;
    dt {
      flex: 1;
      overflow: hidden;
    }
    dd {
      color: #F7D400;
      position: relative;
      border: .01rem solid #E0C294;
      padding: .05rem;
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      .play-icon {
        position: absolute;
        z-index: 5;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        width: .32rem;
        height: .32rem;
        border-radius: 50%;
        background: rgba(0, 0, 0, .5);
        span {
          line-height: .32rem;
          text-align: center;
          font-size: .16rem;
          margin-left: .09rem;
        }
      }
      img,
      .container {
        border-radius: 50%;
        width: .8rem;
        height: .8rem;
        position: relative;
        overflow: hidden;
        z-index: 2;
      }
      .container {
        z-index: 3;
      }
    }
  }
  .date {
    height: .18rem;
    width: 100%;
    position: absolute;
    bottom: 0;
    background: #DFC092;
    font-size: .1rem;
    color: #FFF;
    text-align: center;
    line-height: .16rem;
    z-index: 2;
  }
  &.left {
    dd {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
    }
    dt {
      padding-right: .15rem;
      padding-left: .05rem;
    }
  }
  &.left.first {
    dd {
      border-radius: 50%;
      border: .01rem solid #E0C294;
      .mask {
        position: absolute;
        z-index: 1;
        width: 50%;
        height: 90%;
        bottom: 0;
        right: -.02rem;
        background: #FFF;
      }
    }
  }
  &.right {
    dd {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: none;
    }
    dt {
      padding-left: .15rem;
      p {
        text-align: left !important;
      }
    }
  }
  &.last {
    margin-bottom: .15rem;
    &.left dd {
      border: .01rem solid #E0C294;
      border-radius: 50%;
      .mask {
        position: absolute;
        z-index: 1;
        width: 50%;
        height: 90%;
        top: 0;
        right: -.02rem;
        background: #FFF;
      }
    }
    &.right dd {
      border-radius: 50%;
      border: .01rem solid #E0C294;
      .mask {
        position: absolute;
        z-index: 1;
        width: 50%;
        height: 90%;
        top: 0;
        left: -.02rem;
        background: #FFF;
      }
    }
  }
  .title {
    font-size: .14rem;
    font-weight: bold;
    line-height: .24rem;
    width: 100%;
    margin: .04rem 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .intro {
    font-size: .12rem;
    line-height: .16rem;
    width: 100%;
    height: .48rem;
    overflow: hidden;
    white-space: wrap;
    text-overflow: ellipsis;
  }
}
</style>
