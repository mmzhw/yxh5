<template>
  <div
    class="load-error"
  >
    <div class="img-wrap">
      <img class="load-error-icon" src="../../assets/common/no-movie.svg" alt="">
      <p class="load-error-desc">暂时没有相关影片哦</p>
    </div>
  </div>
</template>

<script>

export default {
    name: 'load-error',

    data () {
        return {
        };
    }
};
</script>

<style scoped>
.load-error {
  text-align: center;
  width: 100%;
  .img-wrap {
    margin-bottom: 1.5rem;
    .load-error-icon {
      margin-top: 1.5rem;
      width: .587rem;
      height: .447rem;
    }
    .load-error-desc {
      color: #AAA;
      font-weight: 300;
      font-size: .16rem;
      line-height: .22rem;
      margin-top: .1rem;
    }
  }
}

</style>
