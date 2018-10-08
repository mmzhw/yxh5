<template>
<div class="navigation">
  <ul class="item-container" @click="move">
    <router-link
      class="item"
      :to="{name:'Index',
      params: {channelId: 0}}"
    >
      精选
    </router-link>
    <router-link
      v-for="(option, i) in channels"
      class="item"
      :key='i'
      :to="{name:'Index', params: {channelId: option.id}}"
      tag="li"
    >
      {{option.name}}
    </router-link>
  </ul>
</div>
</template>
<script>
export default {
    name: 'e-navigation',
    props: ['channels'],
    data () {
        return {
        };
    },
    methods: {
        move (e) {
            let windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
            let targetDomPos = e.target.getClientRects()[0];
            let targetDom = document.querySelector('.item-container');
            let itemWidth = targetDomPos.width;
            if (targetDomPos.right > windowWidth) {
                targetDom.style.transition = 'transform .2s';
                targetDom.scrollLeft += itemWidth + 20;
            }
            if (targetDomPos.left < 0) {
                targetDom.style.transition = 'transform .2s';
                targetDom.scrollLeft = 0;
            }
            e.preventDefault();
        }
    }
};
</script>
<style scoped>
div,
ul {
  -webkit-overflow-scrolling: touch;
}

.navigation {
  width: 100%;
  height: .4rem;
  background: #FFF;
  overflow-x: hidden;
  overflow-y: hidden;
  font-size: .16rem;
  line-height: .37rem;
  margin-bottom: .05rem;
  color: #4A4A4A;
  border-bottom: .01rem solid #EBEBEB;
}

.item-container {
  height: .5rem;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 100%;
}

.item {
  position: relative;
  display: inline-block;
  padding: 0 .15rem;
  line-height: .4rem;
}

.router-link-exact-active {
  font-weight: 700;
  color: #FABE00;
}

.router-link-exact-active::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  display: inline-block;
  width: 100%;
  height: .03rem;
  background-color: #FABE00;
}
</style>
