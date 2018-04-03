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

/**
 * 因为加 0.1 所以处理一下，否则会出现 0.30000000000000004
 *
 * @param {number} a （被）加数
 * @param {number} b 加数
 * @returns {number}  结果
 */
export function add (a, b) {
  return Math.round((a + b) * 10) / 10
}

/**
 * 真·四舍五入
 *
 * @param {number} num 目标数值
 * @param {number} decimals 精确小数位个数
 * @returns {number}  结果
 */
export function round (num, decimals) {
  return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals)
}

/**
 * 截断至小数位后几位
 *
 * @param  {number} num 目标数值
 * @param  {number} decimals 保留小数位
 * @returns {number}  结果
 */
export function truncDecimal (num, decimals) {
  let match = num.toString().match(new RegExp(`(\\d+\\.\\d{${decimals}})(\\d)`))
  return match ? parseFloat(match[1]) : num
}
