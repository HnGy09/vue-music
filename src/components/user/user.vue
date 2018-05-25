<template>
  <transition name="slide">
    <div class="user">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" :data="favoriteList" v-if="currentIndex===0">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectItem"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" :data="playHistory" v-if="currentIndex===1">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectItem"></song-list>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {mapGetters, mapActions} from 'vuex'
import Song from 'common/js/song'
import {playlistMixin} from 'common/js/mixins'

export default {
  mixins: [
    playlistMixin
  ],
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  data() {
    return {
      switches: [
        {
          name: '我喜欢的'
        }, {
          name: '最近听的'
        }
      ],
      currentIndex: 0
    }
  },
  methods: {
    playlistHandle(playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    selectItem(song) {
      this.insertSong(new Song(song))
    },
    random() {
      // console.log(this.favoriteList)
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (!list.length) {
        return
      }
      list = list.map((item) => {
        return new Song(item)
      })
      this.randomPlay({list})
    },
    back() {
      this.$router.back()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    ...mapActions([
      'randomPlay',
      'insertSong'
    ])
  },
  components: {
    Switches,
    SongList,
    Scroll
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .user
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 100
    background: $color-background
    &.slide-enter-active, &.slide.leave-active
      transition: all 0.2s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(0, 100%, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
