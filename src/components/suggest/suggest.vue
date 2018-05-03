<template>
    <div class="suggest">
      <ul class="suggest-list">
        <li class="suggest-item" v-for="(item, index) in result" :key="index">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name" >
            <p class="text"  v-html="getDisplayName(item)"></p>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

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
      page: 1
    }
  },
  created() {
    this._getSearchResult()
  },
  methods: {
    _getSearchResult() {
      this.page = 1
      // console.log(this.query)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._getResult(res.data)
          console.log(this.result)
        }
      })
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
      console.log(item.type)
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    }
  },
  watch: {
    query(newQuery) {
      this._getSearchResult(newQuery)
    }
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
