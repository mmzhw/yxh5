<template>
  <div class="about-me" v-if="personInfoList instanceof Array">
    <div class="panel" v-for="(personInfo, index) in personInfoList" v-bind:key="index">
      <div class="title">{{personInfo.title }}</div>
      <div class="row" v-for="(row, index2) in personInfo.rowList" v-bind:key="index2"><div v-if="row.label" class="label">{{row.label}}：</div><div class="text">{{row.text}}</div></div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'about',
    props: ['personInfoList'],
    data() {
        return {};
    },
};
</script>

<style scoped>

.about-me {
  width: 100%;
  height: 100%;
  text-align: left;
  overflow-y: auto;
  overflow-x: hidden;
}

.panel {
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  padding: .1rem 0;
  margin: 0 .1rem;
}

.panel:last-child {
  border: 0;
}

.title {
  width: 100%;
  height: .34rem;
  font-size: .14rem;
  font-family: PingFangSC-Regular;
  color: rgba(51, 51, 51, 1);
  line-height: .34rem;
  padding-left: .19rem;
  position: relative;
}

.title::before {
  content: ' ';
  width: .04rem;
  height: .14rem;
  background: rgba(255, 189, 0, 1);
  border-radius: .01rem;
  position: absolute;
  top: .1rem;
  left: .07rem;
}

.row {
  line-height: .28rem;
  color: rgba(128, 128, 128, 1);
  font-size: .15rem;
  padding-left: .2rem;
  padding-right: .2rem;
}

.row > .label {
  display: inline-block;
  vertical-align: text-top;
  text-align: right;
  line-height: .28rem;
}

.row > .text {
  display: inline-block;
  vertical-align: text-top;
  text-align: left;
  line-height: .28rem;
  word-break: break-all;
  word-wrap: break-word;
}

.row::after {
  clear: both;
  content: ' ';
  height: 0;
  visibility: hidden;
  display: block;
}
</style>
