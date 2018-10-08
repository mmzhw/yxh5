<template>
  <div class="videos-list-title-wrap">
    <img v-if="icon" v-lazy="imageUrl + icon" class="title-icon">
    <h3 class="videos-list-title" v-if="title" :class="{ 'new-model' : parseInt(channelId) === 0 }">
      {{ title }}
    </h3>
    <div v-if="false" class="more">
      <img src="../assets/common/more.svg" alt="">
    </div>
  </div>
</template>
<script>
import { imageUrl } from '../../util/index.js';
export default {
    name: 'all-models-title',
    props: ['channelId', 'title', 'icon'],
    created() {
        this.imageUrl = imageUrl;
    },
};
</script>
<style scoped>
.videos-list-title-wrap {
  padding: .05rem;
  overflow: hidden;
  .title-icon {
    width: .3rem;
    height: .3rem;
    float: left;
    margin-right: .05rem;
  }
  .videos-list-title {
    float: left;
    color: #111;
    font-size: .16rem;
    line-height: .3rem;
    width: 3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &.new-model {
      font-size: .17rem;
    }
  }
  .more {
    float: right;
    & > img {
      margin-top: .04rem;
      width: .113rem;
      height: .113rem;
    }
  }
}
</style>
