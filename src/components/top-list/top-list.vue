<template>
  <transition name="slide">
    <music-list :bg-image="bgImage" :title="title" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  computed: {
    ...mapGetters([
      'topList'
    ]),
    bgImage() {
      if (this.songs.length && this.songs[0].image) {
        return this.songs[0].image
      }
      return this.topList.picUrl
    },
    title() {
      return this.topList.topTitle
    }
  },
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  created() {
    this.getMusicList()
  },
  methods: {
    getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalized(res.songlist)
          // console.log(res.songlist)
          // console.log(this.songs)
        }
      })
    },
    _normalized(list) {
      let ret = []
      list.forEach((item) => {
        if (item.data.songid && item.data.albummid) {
          ret.push(createSong(item.data))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped rel="stylesheet/stylus" lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease
  .slide-enter, slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
