import BigNumber from 'bignumber.js'

const isGreaterThan = (a, b) => BigNumber(a).gt(b)
const multiply = (a, b) => BigNumber(a).times(b).toString()
const divide = (a, b) => BigNumber(a).dividedBy(b).toString()
const add = (a, b) => BigNumber(a).plus(b).toString()

export default {
  isGreaterThan,
  multiply,
  divide,
  add
}
