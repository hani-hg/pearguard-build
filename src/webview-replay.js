'use strict'

// Keep a bounded window of recent Bare -> WebView events. A WebView reload
// resets its own last-seen sequence, so replay(0) returns the retained window.
const DEFAULT_CAP = 100

class ReplayBuffer {
  constructor(cap = DEFAULT_CAP) {
    this._cap = Number.isInteger(cap) && cap > 0 ? cap : DEFAULT_CAP
    this._events = []
    this._lastSeq = 0
  }

  get size() {
    return this._events.length
  }

  get lastSeq() {
    return this._lastSeq
  }

  record(event, data) {
    const record = { seq: ++this._lastSeq, event, data }
    this._events.push(record)
    if (this._events.length > this._cap) {
      this._events.splice(0, this._events.length - this._cap)
    }
    return record
  }

  replay(afterSeq = 0) {
    const seq = Number.isFinite(afterSeq) ? afterSeq : 0
    return this._events.filter((record) => record.seq > seq)
  }
}

module.exports = { ReplayBuffer, DEFAULT_CAP }
