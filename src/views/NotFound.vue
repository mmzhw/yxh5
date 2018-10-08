<template>
  <div
    class="not-found"
  >
    <div class="img-wrap">
      <img class="not-found-icon" src="../assets/common/not-found.svg" alt="">
      <p class="not-found-desc">程序员快出来背黑锅！</p>
    </div>
    <div style="height: 2.2rem;">
      <router-link class="to-index" :to="{name: 'Index'}">回到首页</router-link>
    </div>
  </div>
</template>

<script>

export default {
    name: 'not-fonudp',

    data () {
        return {
        };
    },
};
</script>

<style scoped>
.not-found {
  text-align: center;
  width: 100%;
  height: 100vh;
  .not-found-icon {
    margin-top: 1rem;
    width: 1.6rem;
    height: 2.2rem;
  }

  .not-found-desc {
    color: #070102;
    font-size: .14rem;
    line-height: .2rem;
    margin-top: -.5rem;
  }

  .to-index {
    display: inline-block;
    margin-top: .3rem;
    margin-left: -.1rem;
    color: #070102;
    font-size: .15rem;
    line-height: .21rem;
    padding: .1rem .39rem .09rem;
    border: 1px solid;
    border-radius: .2232rem;
  }
}
</style>
