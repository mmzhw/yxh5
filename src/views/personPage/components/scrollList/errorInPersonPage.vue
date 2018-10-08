<template>
    <div class="error-box">
      <div class="error-img">
          <img src="../../../../assets/personPage/error_noData.png" alt="" />
      </div>
      <div class="text">{{errorTipText}}</div>
    </div>
</template>

<script>

export default {
    name: 'errorInPersonPage',
    components: {},
    props: ['errorTipText'],
    data() {
        return {};
    },
};
</script>

<style scoped>

.error-box {
  box-sizing: border-box;
  padding-top: .5rem;
  text-align: center;
}

.error-img {
  width: .8rem;
  height: .8rem;
  margin: 0 auto;
}

.error-img img {
  width: 100%;
  height: 100%;
}

.text {
  margin-top: .2rem;
  line-height: .2rem;
}

</style>
