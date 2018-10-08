<template>
  <div>
    <div class="logo-bannner" v-show="visible">
      <div class="logo-bannner-wrap clearfix">
        <Logo></Logo>
        <div class="btn-wrap">
          <button class="btn-search" @click="showSearch"></button>
          <button class="open-app" @click="jumpApp">打开APP</button>
        </div>
      </div>
    </div>
    <Search class="search-banner" @hide-search="hideSearch" :showList="isShowSuggest" @show-list="setShowlist" v-if="!visible" />
  </div>
</template>

<script>
import { jump } from '../util/jump.js';
import Search from './search/Search.vue';
import Logo from './Logo/Logo.vue';

export default {
    name: 'logo-bannner',
    props: ['isShowSuggest'],
    components: {
        Search,
        Logo
    },
    data () {
        return {
            visible: true,
        };
    },
    methods: {
        setShowlist (value) {
            this.$emit('setShowSuggest', { showSuggest: value.isShowlist });
        },
        hideSearch (ifHideSearch) {
            this.visible = ifHideSearch;
        },
        jumpApp() {
            // jump.gotoDownload();
            jump.openBrowserToAppOrDownload({ action: 'home' });
        },
        showSearch () {
            this.setShowlist(true);
            this.visible = false;
        },
        jumpSelect () {
            this.$router.push({
                name: 'Index',
                params: {
                    channelId: 0
                }
            });
        }
    }
};
</script>

<style scoped>
.clearfix::after {
  display: table;
  content: '';
  clear: both;
}

.logo-bannner {
  width: 100%;
  background: #0A0A0A;
  &-wrap {
    box-sizing: border-box;
    padding: .1rem;
    width: 100%;
    height: .5rem;
  }
  &-logo {
    margin-top: -.05rem;
    width: .8rem;
  }

  .btn-wrap {
    float: right;
    height: 100%;
    .open-app {
      display: inline-block;
      font-size: .13rem;
      box-sizing: border-box;
      color: #FFF;
      outline: none;
      border: 0;
      width: .9rem;
      background: #FABE00;
      border-radius: 4px;
      padding: 0;
      height: .3rem;
      line-height: .3rem;
    }
    .btn-search {
      display: inline-block;
      background: url(../assets/common/search.png) no-repeat center center;
      border: none;
      background-size: 100% auto;
      width: .38rem;
      height: .3rem;
      vertical-align: middle;
      padding: 0;
      margin-right: .12rem;
    }
  }
}

.search-banner {
  height: .5rem;
}

</style>
