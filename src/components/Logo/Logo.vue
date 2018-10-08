<template>
  <div class="logo-youxiang">
    <router-link :to="{name: 'Index',params: {channelId: channelIdArr[0]}}">
      <img class="logo-image" src="../../assets/common/top-logo.png" alt="">
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'logo',
    computed: {
        ...mapState({
            channelIdArr: state => {
                return state.channelIdArr;
            }
        }),
    }
};

</script>

<style>
  .logo-youxiang {
    display: inline-block;
    .logo-image {
      height: .29rem;
    }
  }
</style>
