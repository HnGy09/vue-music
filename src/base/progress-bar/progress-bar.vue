<template>
  <div class="progress-bar"  ref="progressBar">
    <div class="bar-inner" ref="barInner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.x1 = e.touches[0].pageX
    },
    progressTouchMove(e) {
      const width = this.$refs.barInner.clientWidth - progressBtnWidth
      this.touch.x2 = e.touches[0].pageX
      const deltaX = e.touches[0].pageX - this.touch.x1
      if (deltaX >= 0 && deltaX <= width - this.touch.x1) {
        this.offsetWidth(deltaX)
      } else if (deltaX < 0 && deltaX >= this.touch.x1) {
        this.offsetWidth(deltaX)
      }
    },
    progressTouchEnd() {
      const width = this.$refs.barInner.clientWidth - progressBtnWidth
      const time = (this.touch.x2 / width) * this.currentSong.duration
      console.log(time)
      // this.$refs.audio.currentTime = time
    },
    offsetWidth(width) {
      this.$refs.progressBtn.style.transform = `translate3d(${width}px,0,0)`
      this.$refs.progress.style.width = `${width}px`
    }
  },
  watch: {
    percent(newPercent) {
      const width = this.$refs.barInner.clientWidth - progressBtnWidth
      const offsetWidth = width * newPercent
      this.offsetWidth(offsetWidth)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
