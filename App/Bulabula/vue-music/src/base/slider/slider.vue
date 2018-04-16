<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active:currentPageIndex === index}"  v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script>
import {addClass} from 'common/js/dom'
import BScroll from 'better-scroll'

export default {
  name: 'slider',
  props: {
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    loop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPageIndex: 0,
      dots: []
    }
  },
  mounted() {
    setTimeout(() => {
      this.setSliderWidth()
      this.initSlider()
      this.dot()
      if (this.autoPlay) {
        this.play()
      }
    }, 20)
  },
  methods: {
    setSliderWidth() {
      let sliderGroupWidth = this.$refs.slider.clientWidth
      this.children = this.$refs.sliderGroup.children
      console.log(this.children)
      let width = 0
      for (var i = 0; i < this.children.length; i++) {
        addClass(this.children[i], 'slider-item')
        this.children[i].style.width = sliderGroupWidth + 'px'
        width += sliderGroupWidth
      }
      if (this.loop) {
        width += 2 * sliderGroupWidth
      }
      this.$refs.sliderGroup.style.width = `${width}px`
    },
    initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        // snap: true,
        // snapLoop: this.loop,
        // snapThreshold: 0.3,
        // snapSpeed: 400
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        click: true
      })
      this.slider.on('scrollEnd', () => {
        let index = this.slider.getCurrentPage().pageX
        // if (this.loop) {
        //   index = index - 1
        // }
        this.currentPageIndex = index
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this.play()
        }
      })
      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    dot() {
      console.log(this.children)
      this.dots = new Array(this.children.length - 2)
    },
    play() {
      // let currentPage = this.currentPageIndex + 1

      if (this.loop) {
        // currentPage += 1
        // if (currentPage > 5) {
        //   currentPage = -1
        // }
        // console.log(currentPage)
      }
      this.timer = setTimeout(() => {
        // this.slider.goToPage(currentPage, 0, 400)
        this.slider.prev(400)
      }, this.interval)
    }
  },
  components: {
    BScroll
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px

  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%

  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
