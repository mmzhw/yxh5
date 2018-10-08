<template>
    <div class="dynamics" v-if="dynamicsList instanceof Array" v-on:scroll="(e)=>{scroll('dynamics',e)}">
        <div class="row" v-for="(item,index) in dynamicsList" v-bind:key="index">
            <div class="leftBox">
                <img v-if="avatar" v-bind:src="avatar" alt="" />
                <img v-else src="../../../../assets/personPage/avatar.png" alt="" />
            </div>
            <div class="rightBox">
                <div class="nickName">{{nickName}}</div>
                <div class="gmtCreated">{{item.gmtCreated}}</div>
                <div class="actionName" style="-webkit-box-orient: vertical;">{{item.actionName}}</div>
            </div>
        </div>
    </div>
</template>

<script>
// import VueScroller from 'vue-scroller';
export default {
    name: 'dynamics',
    components: {
        // VueScroller
    },
    props: ['avatar', 'nickName', 'dynamicsList', 'scroll'],
    methods: {
    }
};
</script>

<style scoped>
.dynamics {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-align: left;
  overflow-y: auto;
  overflow-x: hidden;
  padding: .1rem 0;
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
}

.leftBox {
  width: .5rem;
  height: .5rem;
  padding: .1rem;
  border-radius: 50%;
  overflow: hidden;
}

.leftBox img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.rightBox {
  box-sizing: border-box;
  width: 100%;
  margin-left: -.7rem;
  padding-left: .7rem;
  padding-right: .1rem;
}

.nickName,
.gmtCreated,
.actionName {
  line-height: .23rem;
}

.nickName {
  font-size: .15rem;
  font-family: PingFangSC-Medium;
  color: rgba(102, 102, 102, 1);
}

.gmtCreated {
  font-size: .14rem;
  font-family: PingFangSC-Regular;
  color: rgba(179, 179, 179, 1);
}

.actionName {
  font-size: .16rem;
  font-family: PingFangSC-Regular;
  color: rgba(51, 51, 51, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: .46rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
}
</style>
