<template>
    <scroll class="suggest"
            :pullup="pullup"
            @scrollToEnd="searchMore"
            ref="suggest"
            :data="result"
            :beforeScroll="beforeScroll"
            @beforeScroll="listenScroll"
    >
      <ul class="suggest-list">
        <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name" >
            <p class="text"  v-html="getDisplayName(item)"></p>
          </div>
        </li>
        <loading title="" v-show="hasMore"></loading>
      </ul>
      <div class="no-result-wrapper" v-show="!hasMore && !result.length">
        <no-result title="抱歉，暂无搜索结果"></no-result>
      </div>
    </scroll>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import NoResult from 'base/no-result/no-result'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'

const perpage = 20
const TYPE_SINGER = 'singer'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      result: [],
      page: 1,
      hasMore: true,
      pullup: true,
      beforeScroll: true
    }
  },
  methods: {
    listenScroll() {
      this.$emit('listenScroll')
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    _getSearchResult() {
      this.page = 1
      // console.log(this.query)
      this.hasMore = true
      // console.log(this.$refs.suggest)
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._getResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._getResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    _getResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        console.log(...data.zhida)
        console.log(...{type: TYPE_SINGER})
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        console.log(ret)
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      // console.log(item.type)
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query(newQuery) {
      this._getSearchResult(newQuery)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
