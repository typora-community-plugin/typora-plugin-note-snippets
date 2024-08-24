import 'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js'

export function datetime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

export function date() {
  return dayjs().format('YYYY-MM-DD')
}

export function time() {
  return dayjs().format('HH:mm:ss')
}

export function createSegmentUid() {
  return Math.random().toString(36).slice(2, 8)
}
