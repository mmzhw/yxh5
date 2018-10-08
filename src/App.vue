<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <keep-alive include="activity">
        <router-view class="view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script></script>

<style>
  * {
    padding: 0;
    margin: 0;
    border: 0;
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
