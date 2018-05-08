<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query.length" ref="shortcutWrapper">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li class="item" v-for="(item, index) in hotKey" :key="index" @click="addQuery(item.k)">
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showFlag">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @select="saveSearch" ref="suggest" @listScroll="blurInput"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/search-list/search-list'
import {mapActions, mapGetters} from 'vuex'
import Confirm from 'base/confirm/confirm'
import {playlistMixin} from 'common/js/mixins'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
    shortcut() {
      return this.searchHistory.concat(this.hotKey)
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    playlistHandle(playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    showFlag() {
      this.$refs.confirm.show()
    },
    onQueryChange(query) {
      // console.log(query)
      this.query = query
    },
    saveSearch() {
      console.log(this.query)
      this.saveSearchHistory(this.query)
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    deleteSearchHistory(item) {
      this.deleteSearchHistory(item)
    },
    _getHotKey() {
      console.log(this.searchHistory)
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
          // console.log(this.hotKey)
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    Scroll,
    SearchList,
    Confirm
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
