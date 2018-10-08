<template>
    <div class="myViewList">
        <div class="row-title">拍单({{myViewList.length}})</div>
        <div class="row" v-if="myViewList instanceof Array"  v-for="(item,index) in myViewList" v-bind:key="index" v-on:click="()=>{ goToVideo(item) }">
            <div class="leftBox">
                <div class="img" v-bind:style="{backgroundImage: `url(${item.picUrl})`}"></div>
                <!-- <img v-bind:src="item.picUrl" alt="" /> -->
            </div>
            <div class="rightBox">
                <div class="title">{{item.title}}</div>
                <div class="introduction" style="-webkit-box-orient: vertical;">{{item.introduction}}</div>
                <div class="time">{{item.time}}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'myViewList',
    components: {
        // VueScroller
    },
    props: ['myViewList', 'goToVideo', 'errorTipText'],
    data() {
        return {
        };
    },
    methods: {
        // scroll (e) {
        //     console.log('eee', e);
        // }
    }
};
</script>

<style scoped>
.myViewList {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-align: left;
  overflow-y: auto;
  overflow-x: hidden;
  padding: .1rem 0;
}

.row-title {
  width: 100%;
  height: .4rem;
  line-height: .4rem;
  background: rgba(241, 241, 241, 1);
  font-size: .16rem;
  color: rgba(52, 52, 52, 1);
  padding: 0 .16rem;
}

.row {
  padding: .1rem 0;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
}

.row::after {
  content: ' ';
  clear: both;
  height: 0;
  visibility: hidden;
  display: block;
}

.leftBox,
.rightBox {
  float: left;
  padding: .1rem;
}

.leftBox {
  width: 1.1rem;
  height: .62rem;
}

.leftBox .img {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.rightBox {
  box-sizing: border-box;
  width: 100%;
  margin-left: -1.3rem;
  padding-left: 1.3rem;
  padding-right: .1rem;
}

.title {
  font-size: .14rem;
  font-family: PingFangSC-Regular;
  color: rgba(51, 51, 51, 1);
  line-height: .2rem;
}

.introduction {
  font-size: .12rem;
  font-family: PingFangSC-Regular;
  color: rgba(153, 153, 153, 1);
  line-height: .17rem;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: .07rem;
  max-height: .17rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  word-wrap: break-word;
}

.time {
  font-size: .12rem;
  font-family: PingFangSC-Regular;
  color: rgba(153, 153, 153, 1);
  line-height: .17rem;
}
</style>
