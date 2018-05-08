import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

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

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error())
        }
      })
    })
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
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=4858693552&vkey=15C7874562440CDA672A0891682D746236AD4BA26EE974B460BDFCA43E9399B8873F90E38895B09645D5E370F80160CEE4883872A9A3F67A&uin=0&fromtag=38`
    // http://ustbhuangyi.com/music/#/search
    url: `http://dl.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?guid=126548448&fromtag=0`
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

// // 3. qq音乐歌曲媒体url 需要 mid处理 然后拼成
// // 前端
// // url_mid获取
// let _uid = ''
//
// function genUrlMid(mids, types) {
//   function getUid() {
//     if (_uid) {
//       return _uid;
//     }
//     if (!_uid) {
//       const t = (new Date).getUTCMilliseconds();
//       _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10;
//     }
//     return _uid
//   }
//
//   const guid = getUid()
//   return {
//     module: 'vkey.GetVkeyServer',
//     method: 'CgiGetVkey',
//     param: {
//       guid,
//       songmid: mids,
//       songtype: types,
//       uin: '0',
//       loginflag: 0,
//       platform: '23'
//     }
//   }
// }
//
// // 参数mids:[song1.mid, song2.mid, song3.mid....] types[0, 0 ,0, ..song.length]
//
// // 获取purl
// const urlMid = genUrlMid(mids, types);
// const data = {
//   g_tk: 5381,
//   format: 'json',
//   platform: 'h5',
//   needNewCode: 1,
//   uin: 0,
//   inCharset: 'utf-8',
//   outCharset: 'utf-8',
//   notice: 0
// }
// axios.post('/api/getPurlUrl', {
//   comm: data,
//   url_mid: urlMid
// }).then((res) => {
//   let infos = res.url_mid.data.midurlinfo;
//   songs.forEach((song, index) => {
//     song.url = `http://dl.stream.qqmusic.qq.com/${info[index].purl}`; // 拼接真正有效的url
//   })
// })
