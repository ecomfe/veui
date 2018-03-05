/**
 * 判断两个数字是否相等，支持区分 -0 和 0
 *
 * @param {number} a 第一个比较数字
 * @param {number} b 第二个比较数字
 * @returns {boolean} 是否相同
 */
export function is (a, b) {
  if (a !== b) {
    return false
  }

  return 1 / a === 1 / b
}

/**
 * 符号函数，大于 0 返回 1，小于 0 返回 -1，0 返回 0
 *
 * @param {number} a 第一个比较数字
 * @param {number} b 第二个比较数字
 * @returns {boolean} 是否相同
 */
export function sign (num) {
  if (num === 0) {
    return 0
  }

  return num > 0 ? 1 : -1
}

/**
 * 判断一个数是否为正数，0 为正，-0 为负
 * @param {number} num 目标数值
 * @returns {boolean} 是否为正
 */
export function isPositive (num) {
  return num > 0 || is(num, 0)
}
