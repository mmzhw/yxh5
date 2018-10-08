<template>
  <section class="search" v-if="showSearch">
    <section class="search-bar" v-if="showLogo">
      <div class="logo-wrap"  @click="gotoIndex">
        <Logo></Logo>
      </div>
      <div class="search-input">
        <div class="input-container"></div>
        <img class="search-icon" src="../../assets/common/search.svg">
        <input type="text" id="keyword" v-on:input="onInput" v-model="keyword" @click="inputClick" @keyup="getSuggest" @keyup.enter="search" placeholder="请输入影片" maxlength="20" autofocus>
        <img class="clear-icon" src="../../assets/search/clear.svg" v-if="showClear" @click="clearInput">
      </div>
      <div class="search-btn" @click="search">
        <div class="search-txt" id="search" v-if="showSearchTxt">搜索</div>
        <div class="cancel-btn" id="search" v-else>取消</div>
      </div>
    </section>
    <section class="search-bar no-logo" v-else>
      <div class="search-input">
        <div class="input-container"></div>
        <img class="search-icon" src="../../assets/common/search.svg">
        <input type="text" id="keyword" v-on:input="onInput" v-model="keyword" @click="inputClick" @keyup="getSuggest" @keyup.enter="search" placeholder="请输入影片" maxlength="20" autofocus>
        <img class="clear-icon" src="../../assets/search/clear.svg" v-if="showClear" @click="clearInput">
      </div>
      <div class="search-btn" @click="search" id="search" v-if="showSearchTxt">搜索</div>
      <div class="search-btn cancel-btn" @click="search" id="search" v-else>取消</div>
    </section>
    <transition name="slide-fade">
      <section class="search-suggest" v-if="showSuggest">
        <ul>
          <li v-for="item in suggestList" @click="hideSuggest">
            <router-link :to="{ name: 'Search', query: { keyword: item.videoName }}" v-html="item.newVideoName"></router-link>
          </li>
        </ul>
      </section>
    </transition>
    <section class="shade" id="shade" v-if="showSuggest" @click="hideShade" :class="{ lightshade: showLightShade }"></section>
  </section>
</template>

<script>
import titleMixin from '../../mixins/title-mixin';
import Logo from '../Logo/Logo.vue';
export default {
    name: 'search',
    props: ['showList'],
    components: {
        Logo
    },
    mixins: [titleMixin],
    title () {
        if (this.keyword) {
            return `有象视频-${this.keyword}`;
        }
        return '有象视频';
    },
    data () {
        return {
            keyword: '',
            suggestList: [],
            showClear: false,
            showSuggest: false,
            showSearch: true,
            showLogo: false,
            showSearchTxt: true,
            showLightShade: false,
        };
    },
    mounted () {
        if (this.$route.query.keyword) {
            this.showSuggest = false;
        } else {
            document.getElementById('keyword').click();
        }
    },
    created () {
        const keyword = this.$route.query.keyword;
        if (keyword) {
            this.showLogo = true;
            this.showClear = true;
            this.showSuggest = false;
            this.keyword = keyword;
        } else {
            this.showLogo = false;
            this.getHotTop();
      // 搜索框获取焦点
        }
    },
    watch: {
        '$route.query.keyword': function () {
            const keyword = this.$route.query.keyword;
            if (keyword) {
                this.keyword = keyword;
                this.showLogo = true;
                this.showClear = true;
                this.showShade = false;
            } else {
                this.showLogo = false;
            }
            this.showSuggest = false;
            this.showSearchTxt = true;
        },
        'showSuggest': function () {
      // document.getElementById('keyword').focus()
            if (this.showSuggest) {
                document.getElementById('keyword').focus();
            }
        }
    },
    methods: {
        onInput () {
            this.showClear = true;
            let x = { target: { value: this.keyword }};
            this.getSuggest(x);
            this.showSuggest = true;
        },
        hideSuggest () {
            this.showClear = true;
            this.showSuggest = false;
            this.keyword = this.$route.query.keyword;
        },
        gotoIndex () {
            this.showSuggest = false;
        },
        inputClick (e) {
            if (!this.keyword) {
                this.getHotTop();
                this.showSearchTxt = false;
            } else {
                this.getSuggest(e);
                this.showSearchTxt = true;
            }
            this.showSuggest = true;
        },
        clearInput (e) {
      // 清除输入
            this.keyword = '';
            this.showClear = false;
            this.showSuggest = false;
            this.getSuggest(e);
            document.getElementById('keyword').focus();
            this.showSearchTxt = false;
        },
        hideShade () {
            this.showShade = false;
            this.showSuggest = false;
        },
        search () {
      // 点击搜索，跳转到搜索结果页面
            if (document.getElementById('search').innerHTML === '搜索') {
                if (this.keyword.trim()) {
                    this.$router.push({
                        name: 'Search',
                        query: { keyword: this.keyword }
                    });
                }
            } else {
        // 点击取消，隐藏搜索框，显示banner
                this.$emit('hide-search', { hideSearch: true });
        // 搜索结果页面点击取消，停留在当前页面
                if (this.$route.query.keyword) {
                    this.showSearchTxt = true;
                }
            }
            this.showSuggest = false;
        },
        getHotTop () {
      // 获取最热词列表
            this.axios.post('/m_web/search/hotTop', { pageSize: 5 })
            .then(res => {
                if (res.code === 0) {
                    res.data.map(item => {
                        item.newVideoName = item.videoName;
                    });
                    document.getElementById('keyword').focus();
                    this.suggestList = res.data;
                    this.showSuggest = true;
                    this.showLightShade = true;
                }
            }).catch(err => console.error(err));
        },
        getSuggest (e) {
            if (e.keyCode !== 13) {
        // 关键词搜索结果列表
                this.showClear = true;
                if (e.target.value || this.keyword) {
                    this.showSearchTxt = true;
                    this.axios.post('/m_web/search/suggest', { word: e.target.value, pageSize: 5 })
                    .then(res => {
                        if (res.code === 0) {
                        // 关键词高亮
                            res.data.map(item => {
                                let itemName = item.videoName;
                                const keyIndex = itemName.indexOf(this.keyword);
                                if (keyIndex > -1) {
                                    const highlightWord = '<span style="color:#FABE00;font-weight:900">' + itemName.substr(keyIndex, this.keyword.length) + '</span>';
                                    item.newVideoName = itemName.substr(0, keyIndex) + highlightWord + itemName.substr(keyIndex + this.keyword.length);
                                } else {
                                    item.newVideoName = item.videoName;
                                }
                            });
                            this.suggestList = res.data;
                            this.showSuggest = true;
                            this.showLightShade = false;
                        }
                    }).catch(err => console.error(err));
                } else {
                    this.showClear = false;
          // 如果输入为空则显示最热词列表
                    this.showSearchTxt = false;
                    this.getHotTop();
                }
            } else {
                this.showSuggest = false;
            }
        },
    }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all .3s ease-in-out;
}

.slide-fade-leave-active {
  transition: all .3s ease-in-out;
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateY(-10px);
  opacity: 0;
}

.shade {
  width: 100%;
  height: 150%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: .7;
  z-index: 9999;
}

.lightshade {
  opacity: .3 !important;
}

.search {
  z-index: 99999;
}

.search-bar {
  z-index: 99999;
}

.search-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  height: .5rem;
  z-index: 99999;
  background: #0A0A0A;
  justify-content: flex-start;
  .logo {
    height: .5rem;
    padding-left: .1rem;
    img {
      width: .8rem;
      margin-top: .05rem;
    }
  }
  .logo-wrap {
    display: flex;
    align-items: center;
    margin-right: .15rem;
    margin-left: .1rem;
  }
}

.input-container {
  position: relative;
  top: .1rem;
  width: 2.1rem;
  height: .3rem;
  line-height: .3rem;
  border-radius: 1rem;
  background: #F2F4F7;
  opacity: .15;
}

.search-input {
  position: relative;
  img {
    width: .124rem;
    height: .143rem;
  }
  .search-icon {
    position: absolute;
    top: .17rem;
    left: .12rem;
  }
  .clear-icon {
    position: absolute;
    top: .18rem;
    right: .1rem;
    width: .14rem;
    height: .14rem;
  }
  input {
    position: absolute;
    top: .1rem;
    left: .33rem;
    width: 1.4rem;
    height: .3rem;
    padding: 0;
    font-size: .14rem;
    font-weight: normal;
    color: #9D9D9D;
    background: transparent;
    border: none;
    outline: none;
  }
}

.search-btn {
  width: .31rem;
  padding-left: .15rem;
  font-size: .15rem;
  text-align: center;
  line-height: .5rem;
  color: #FABE00;
}

.cancel-btn {
  color: #FFF;
}

.search-suggest {
  position: fixed;
  top: .5rem;
  width: 100%;
  z-index: 99999;
  li {
    height: .45rem;
    line-height: .45rem;
    color: #101010;
    background: #FFF;
    border-bottom: .01rem solid #E6E6E6;
    outline: none;
    a {
      display: inline-block;
      padding-left: .15rem;
      width: 100%;
      height: .45rem;
      outline: none;
    }
    a:active {
      background: #F2F2F2;
    }
  }
}

.no-logo {
  .search-input {
    margin-left: .15rem;
    .input-container {
      width: 3rem;
    }
    input {
      width: 2.4rem;
    }
  }
}
</style>
