import Lang from '../constants/lang'

let lang = Lang[process.env.LANG || 'zh-cn']

export default function (score) {

  if (score <= 5) {
    bio(1)
  } else if (score > 5 && score <= 7) {
    bio(7)
  } else if (score > 7) {
    bio(9)
  }

}

function bio(i) {
  let scores = lang.share.score
  let len = scores[i].length - 1
  let str = scores[i][Math.floor(Math.random() * len)]
  return `${lang.share.prefix}”${str}“${lang.share.postfix}`
}
