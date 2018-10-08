<template>
  <div class="jump" v-show="visible">
    <div class="jump-wrap" @click="jumpApp">
      <img class="jump-logo" src="../../assets/common/logo.png" alt="">
      <p>看高清完整版，安装有象视频</p>
      <img class="jump-close" src="../../assets/common/clear.svg" alt="" @click="closeJump">
    </div>
  </div>
</template>

<script>
import { jump } from '../../util/jump.js';

export default {
    name: 'jump',

    props: {
    },

    data () {
        return {
            visible: true,
        };
    },

    computed: {
    },

    watch: {
    },

    methods: {
        closeJump(e) {
            e.stopPropagation();
            this.visible = false;
        },
        jumpApp() {
            jump.gotoDownload();
//      location.href = 'http://www.youxiang0210.com/index.html'
        },
    }
};
</script>

<style scoped>
.jump {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, .8);
  z-index: 99999;
  &-wrap {
    width: 3.2rem;
    height: .5rem;
    margin: 0 auto;
    position: relative;
  }
  p {
    display: inline-block;
    color: #FFF;
    padding-top: .01rem;
    text-align: center;
    line-height: .5rem;
    height: .5rem;
    width: 1.82rem;
    margin-left: .7rem;
  }
  &-logo {
    width: .27rem;
    height: .28rem;
    position: absolute;
    top: .11rem;
    left: .2rem;
  }
  .jump-close {
    position: absolute;
    top: .15rem;
    right: .26rem;
    width: .2rem;
    height: .2rem;
  }
}
</style>
