<template>
  <div>
    <div class="logo-bannner" v-show="visible">
      <div class="logo-bannner-wrap">
        <button @click="openLeftPannel" class="btn-bar"></button>
        <Logo></Logo>
        <button class="btn-search" @click="showSearch"></button>
      </div>
    </div>
    <Search class="search-banner" @hide-search="hideSearch" :showList="isShowSuggest" v-if="!visible" />
  </div>
</template>

<script>
import Search from '../search/Search.vue';
import Logo from '../Logo/Logo.vue';

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
        gotoDownload() {
        },
        openLeftPannel() {
            this.$emit('openleftbar');
        },
        showSearch () {
            this.visible = false;
        },
        hideSearch (ifHideSearch) {
            this.visible = ifHideSearch;
        }
    }
};
</script>

<style scoped>
.logo-bannner {
  width: 100%;
  background: #0A0A0A;
  &-wrap {
    box-sizing: border-box;
    padding: .1rem;
    width: 3.75rem;
    height: .5rem;
    margin: 0 auto;
    text-align: center;
  }
  &-logo {
    width: .68rem;
    height: .34rem;
  }

  .btn-bar {
    background: url(../../assets/common/bar.png) no-repeat center center;
    border: none;
    background-size: 100% auto;
    width: .28rem;
    height: 100%;
    padding: 0;
    float: left;
  }
  .btn-search {
    background: url(../../assets/common/search.png) no-repeat center center;
    border: none;
    background-size: 100% auto;
    width: .38rem;
    height: 100%;
    padding: 0;
    float: right;
  }
}

.search-banner {
  height: .5rem;
}
</style>
