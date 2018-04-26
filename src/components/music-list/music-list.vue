<template>
    <div class="music-list">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title">{{title}}</h1>
      <div class="bg-image" :style="bgStyle" ref="bgImg">
        <div class="play-wrapper">
          <div class="play" ref="playBtn">
            <i class="icon-play"></i>
            <span class="text" @click="changeModeRandom">随机播放全部</span>
          </div>
        </div>
        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <Scroll class="list"
              ref="list"
              @scroll="scroll"
              :listen-scroll="listenScroll"
              :probe-type="probeType"
      >
        <div class="song-list-wrapper">
          <song-list :songs="songs" @select="selectSong"></song-list>
        </div>
      </Scroll>
    </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {mapActions, mapGetters} from 'vuex'
const RESERVED_HEIGHT = 40
export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    bgStyle() {
      console.log(this.playlist)
      return `background-image:url(${this.bgImage})`
    },
    ...mapGetters([
      'playlist'
    ])
  },
  data() {
    return {
      scrollY: 0
    }
  },
  created() {
    this.touch = {}
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.imgHeight = this.$refs.bgImg.clientHeight
    this.$refs.list.$el.style.top = `${this.imgHeight}px`
    this.minTransalteY = -this.imgHeight + RESERVED_HEIGHT
  },
  methods: {
    changeModeRandom() {
      this.randomPlay({
        list: this.songs
        // list: this.playlist开始playlist无数据  不会播放
      })
    },
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectSong(song, index) {
      // console.log(this.songs)
      console.log(index)
      // let list ={
      //   album:"绅士",
      //   duration:261,
      //   id:102636799,
      //   image:"https://y.gtimg.cn/music/photo_new/T002R300x300M000003y8dsH2wBHlo.jpg?max_age=2592000",
      //   mid:"001Qu4I30eVFYb",
      //   name:"演员",
      //   singer:"薛之谦",
      //   url:"http://isure.stream.qqmusic.qq.com/C100001Qu4I30eVFYb.m4a?fromtag=32"
      // }
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0
      let scale = 1
      let translateY = Math.max(this.minTransalteY, newY)
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
      const percent = Math.abs(newY / this.imgHeight)

      if (newY > 0) {
        scale = 1 + percent
        // zIndex = 10
      }

      if (newY < this.minTransalteY) {
        this.$refs.bgImg.style.paddingTop = 0
        this.$refs.bgImg.style.height = RESERVED_HEIGHT + 'px'
        zIndex = 10
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImg.style.paddingTop = '70%'
        this.$refs.bgImg.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImg.style.transform = `scale(${scale})`
      this.$refs.bgImg.style.zIndex = zIndex
    }
  },
  components: {
    SongList,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .music-list
    top: 0
    left: 0
    bottom: 0
    right: 0
    position: fixed
    background-color: $color-background
    z-index: 100
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .title
      position absolute
      top 0
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text-w
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70% // 宽高比10:7
      transform-origin top // 元素基点位置
      background-size cover
      .play-wrapper
        position absolute
        bottom 20px
        z-index 50
        width 100%
        .play
          box-sizing border-box
          width 135px
          padding 7px 0
          margin 0 auto
          text-align center
          border 1px solid $color-theme
          color $color-theme
          border-radius 100px
          font-size 0
          .icon-play
            display inline-block
            vertical-align middle
            margin-right 6px
            font-size $font-size-medium-x
          .text
            display inline-block
            vertical-align middle
            font-size $font-size-small
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background-color rgba(7,17,27,.4)
    .bg-layer
      position relative
      height 100%
      background: $color-background
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      background-color $color-background-g
      .song-list-wrapper
        padding 20px 30px
        background-color $color-background-g
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)

</style>
