import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 1) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])

  let index = searches.findIndex((item) => {
    return item === query
  })
  if (index > -1) {
    searches.splice(index, 1)
  }

  storage.set(SEARCH_KEY, searches)

  return searches
}

// function deleteFromArray(arr, compare) {
//   const index = arr.findIndex(compare)
//   if (index > -1) {
//     arr.splice(index, 1)
//   }
// }

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  console.log(storage.get(PLAY_KEY, []))
  return storage.get(PLAY_KEY, [])
}

// export function deletePlay(song) {
//   let songs = storage.get(PLAY_KEY, [])
//   deleteFromArray(songs, (item) => {
//     return item.id === song.id
//   })
//   return songs
// }
// function insertArrayBF(arr, val, compare, num) {
//   let index = arr.findIndex(compare)
//
//   if (index === 0) {
//     return
//   }
//   if (index > -1) {
//     arr.splice(index, 1)
//   }
//
//   arr.unshift(val)
//
//   if (num && arr.length > num) {
//     arr.pop()
//   }
// }
//
// export function SavePlay() {
//   let songs = storage.get(PLAY_KEY, [])
//
//   insertArrayBF(songs, song, (item) => {
//     return item.id === song.id
//   }, PLAY_MAX_LEN)
//
//   storage.set(PLAY_KEY, songs)
//
//   return songs
// }
