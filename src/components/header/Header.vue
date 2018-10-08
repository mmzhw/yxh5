<template>
  <div class="header">
    <p class="a">aaaaa</p>
  </div>
</template>

<script>
// import { watchList } from '../api'
// import Item from '../components/Item.vue'

export default {
    name: 'header',

  /*
  components: {
    Item
  },
  */

    props: {
    },

    data () {
        return {
        };
    },

    computed: {
    },

    beforeMount () {
    },

    beforeDestroy () {
    },

    watch: {
    },

    methods: {
        test() {
        }
    }
};
</script>

<style scoped>
.header {
  height: 40px;
  width: 100%;
  background: black;
  .a {
    color: green;
  }
}
</style>
