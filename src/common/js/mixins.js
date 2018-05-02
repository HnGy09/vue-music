// import {mapMutations, mapGetters, mapActions} from 'vuex'
import {mapGetters} from 'vuex'
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  methods: {
    playlistHandle() {
      throw new Error('component must implement handlePlaylist method')
    }
  },
  mounted() {
    this.playlistHandle(this.playlist)
  },
  activated() {
    this.playlistHandle(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.playlistHandle(newVal)
    }
  }
}
