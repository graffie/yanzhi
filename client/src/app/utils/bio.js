import Lang from '../constants/lang'

let lang = typeof Lang[process.env.LANG] === 'object' ?
        Lang[process.env.LANG] : Lang['zh-cn'];


export default function (score) {

  function bio(i) {
    let scores = lang.share.score
    let len = scores[i].length - 1
    let str = scores[i][Math.floor(Math.random() * len)]
    return `${lang.share.prefix.replace('%s', score)}“${str}” ${lang.share.postfix}`
  }

  if (score <= 5) {
    return bio(1)
  } else if (score > 5 && score <= 7) {
    return bio(7)
  } else if (score > 7) {
    return bio(9)
  }

}
