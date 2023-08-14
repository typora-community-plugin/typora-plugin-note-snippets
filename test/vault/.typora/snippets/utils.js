
export function createSegmentUid() {
  return Math.random().toString(36).slice(2, 8)
}
