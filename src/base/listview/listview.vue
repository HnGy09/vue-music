<template>
  <scroll class="listview" :data="data" :probeType="3" @scroll="scroll" :listenScroll="listenScroll" ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup" :key="group.id">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item  in group.items" class="list-group-item" :key="item.id">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <ul class="list-shortcut">
        <li v-for="(item, index) in shortCut"
            :key="index"
            class="item"
            :data-index="index"
            :class="{current:currentIndex===index}"
            @touchstart.stop.prevent="onShortcutTouchStart"
            @touchmove.stop.prevent="onShortcutTouchMove"
            @touchend.stop
        >
          <!--currentIndex===index-->
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-if="fixTitle" ref="fixTitle">
      <h2 class="fixed-title">{{fixTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
const FIX_TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: -1,
      diff: -1,
      currentIndex: 0
    }
  },
  computed: {
    shortCut() {
      return this.data.map((item) => {
        return item.title.substr(0, 1)
      })
    },
    fixTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  created() {
    this.touch = {}
    this.listHeight = []
    this.listenScroll = true
  },
  // mounted() {
  //   setTimeout(() => {
  //     this._calculateHeight()
  //   }, 2000)
  // },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      this.touch.y = e.touches[0].pageY
      this.touch.touchIndex = e.target.getAttribute('data-index')
      let newIndex = Number(this.touch.touchIndex)
      this._scrollTo(newIndex)
    },
    onShortcutTouchMove(e) {
      this.touch.y1 = e.touches[0].pageY
      let delta = (this.touch.y1 - this.touch.y) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.touchIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // this.scrollY = -this.listHeight[index]
      console.log(index)
      this.currentIndex = index
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    },
    scroll(pos) {
      this.scrollY = pos.y
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        // console.log(height1)
        // console.log(-newY)
        // console.log(height2)
        // console.log(i + '=====')
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          if ((height2 + newY) < FIX_TITLE_HEIGHT) {
            this.diff = height2 + newY - FIX_TITLE_HEIGHT
          } else {
            this.diff = 0
          }
          this.$refs.fixTitle.style.top = `${this.diff}px`
          return
        }
      }
      this.currentIndex = listHeight.length - 2
      this.$refs.fixTitle.style.top = '0px'
      console.log('底部不够了', this.currentIndex)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
