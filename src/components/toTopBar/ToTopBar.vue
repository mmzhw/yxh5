<template>
  <div
    class="to-top"
    @click="toTop"
  >
    <div class="to-top-icon" >
      <img src="../../assets/to-top/to-top.svg" alt="">
    </div>
  </div>
</template>

<script>

export default {
    name: 'to-top',

    props: {
    },

    data () {
        return {
            scrollTopDistance: 0,
            timer: ''
        };
    },

    methods: {
        toTop(e) {
            e.preventDefault();
            const currScroll = this.scrollTopDistance;
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                let speed = (0 - currScroll) / 5;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                if (this.scrollTopDistance <= 0) {
                    clearInterval(this.timer);
                }
                if (document.body.scrollTop) {
                    document.body.scrollTop = this.scrollTopDistance + speed;
                } else {
                    document.documentElement.scrollTop = this.scrollTopDistance + speed;
                }
                document.documentElement.scrollTop = this.scrollTopDistance + speed;
            }, 1 / 60);
        }
    }
};
</script>

<style scoped>
.to-top {
  position: fixed;
  bottom: .1rem;
  right: .05rem;
  line-height: 0;
  cursor: pointer;
  z-index: 100;
  border-radius: 50%;
  .to-top-icon img {
    opacity: .53;
    width: .5rem;
    height: .5rem;
    display: inline-block;
    border-radius: 50%;
    &:hover {
      opacity: 1;
    }
  }
}

</style>
