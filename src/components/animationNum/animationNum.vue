<template>
  <ul class="animation-num" :class="scrollNum" >
    <li v-for="(n, index) in 10" :key="index">{{index}}</li>
  </ul>
</template>
<script>
export default {
    name: 'animation-num',
    props: ['number', 'idx'],
    computed: {
        scrollNum () {
            this.currentNum = this.number.split('')[this.idx];
            return 'col' + this.idx + ' ' + 'currentNum' + this.currentNum;
        }
    }
};
</script>
<style scoped>
  .animation-num {
    width: 9px;
    height: 480px;
    transition: margin .5s;
    -webkit-transition: margin .5s;
    -o-transition: margin .5s;
    -ms-transition: margin .5s;
    float: left;
    & > li {
      width: 100%;
      height: 48px;
      vertical-align: top;
    }
    &::before {
      content: ' ';
      display: block;
      clear: both;
    }
    &.currentNum0 {
      margin-top: 0;
    }
    &.currentNum1 {
      margin-top: -48px;
    }
    &.currentNum2 {
      margin-top: -96px;
    }
    &.currentNum3 {
      margin-top: -144px;
    }
    &.currentNum4 {
      margin-top: -192px;
    }
    &.currentNum5 {
      margin-top: -240px;
    }
    &.currentNum6 {
      margin-top: -288px;
    }
    &.currentNum7 {
      margin-top: -336px;
    }
    &.currentNum8 {
      margin-top: -384px;
    }
    &.currentNum9 {
      margin-top: -432px;
    }
  }
</style>
