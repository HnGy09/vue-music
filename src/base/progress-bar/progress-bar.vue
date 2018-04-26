<template>
  <div class="progress-bar"  ref="progressBar" @click="progressClickPos">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
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
// import {mapGetters} from 'vuex'
const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'currentSong'
  //   ])
  // },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      // this.touch.initiated = true
      this.touch.x1 = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      const deltaX = e.touches[0].pageX - this.touch.x1
      const offsetWidth = Math.max(0, Math.min(this.touch.left + deltaX, this.$refs.progressBar.clientWidth - progressBtnWidth))
      // console.log(offsetWidth)
      // const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this.offsetWidth(offsetWidth)
    },
    progressTouchEnd() {
      // this.touch.initiated = false
      this._triggerPercent()
    },
    offsetWidth(width) {
      this.$refs.progressBtn.style.transform = `translate3d(${width}px,0,0)`
      this.$refs.progress.style.width = `${width}px`
    },
    progressClickPos(e) {
      const offsetWidth = e.offsetX
      this.offsetWidth(offsetWidth)
      this._triggerPercent()
    },
    _triggerPercent() {
      const width = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / width
      this.$emit('changePercent', percent)
    }
  },
  watch: {
    percent(newPercent) {
      const width = this.$refs.progressBar.clientWidth - progressBtnWidth
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
