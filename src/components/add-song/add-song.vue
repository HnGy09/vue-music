<template>
  <transition name="slide">
    <div v-show="showFlag" @click.stop class="add-song">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches"  @switch="switchItem" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper">
          <!--左边switch-->
          <scroll class="list-scroll" v-show="currentIndex===0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory"></song-list>
            </div>
          </scroll>
          <!--右边switch-->
          <scroll class="list-scroll"  v-show="currentIndex===1" :data="searchHistory">
            <div class="list-inner">
              <search-list :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query"></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'playHistory',
      'searchHistory'
    ])
  },
  data() {
    return {
      showFlag: false,
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'}
      ],
      currentIndex: 0,
      query: ''
    }
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    switchItem(index) {
      this.currentIndex = index
    }
  },
  components: {
    SearchBox,
    Switches,
    SongList,
    SearchList,
    Scroll,
    Suggest
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
