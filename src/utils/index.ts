
import nanoid from 'nanoid'

export const getImgSrc = (canvas: HTMLCanvasElement) => {
  const dataUrl = canvas.toDataURL('image/png')
  return dataUrl
}

export const base64Img2Blob = (code: string) => {
  var parts = code.split(';base64,')
  var contentType = parts[ 0 ].split(':')[ 1 ]
  var raw = window.atob(parts[ 1 ])
  var rawLength = raw.length

  var uInt8Array = new Uint8Array(rawLength)

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[ i ] = raw.charCodeAt(i)
  }

  return new Blob([ uInt8Array ], { type: contentType })
}

export const generate = () => {
  const prefix = 'calendar'
  const id = nanoid(5)
  return `${ prefix }-${ id }`
}

export const downloadFile = (fileName: string, content: string) => {
  var aLink = document.createElement('a')
  var blob = base64Img2Blob(content) //new Blob([content]);
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.click()
}


export function getTimestampByDate (date: Date) {
  return new Date(date).getTime()
}

export function updateArrayItem<T, K extends keyof T> (arr: T[], newItem: T, key: K) {
  console.log('updateArrayItem')
  return arr.map((item: T) => {
    if (item[ key ] !== newItem[ key ]) {
      return item
    } else {
      return {
        ...item,
        ...newItem
      }
    }
  })
}