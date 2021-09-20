export default function (str, separator = '', once) {
  let res = str.split(separator).map(option => option.trim()).filter(option => !!option)

  if(once) {
    res = [res.shift(), res.join(separator)].filter(option => !!option)
  }

  return res
}