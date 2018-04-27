export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration // "持续" --> 歌曲时长
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32  C1L0001ApDs72gYqUk`
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=3182176256&vkey=F85A42A18D71C3C6B99B944A5769B22F5CA734808A92C93E60DCC137197979D0162C847CA07C50711012C721AC170B4301FA0FAB32A9866F&uin=0&fromtag=38`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/') // ?
}
