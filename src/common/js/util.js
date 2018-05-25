function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomNum(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce(func, delay) {
  let timer
  // console.log(func)
  // console.log(...args)
  return function (...args) {
    console.log(...args)
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      console.log(args)
      func.apply(this, args)
    }, delay)
  }
}
