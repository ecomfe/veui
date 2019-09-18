import { isString } from 'lodash'

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
 * 处理浮点数精度问题
 *
 * @param {number} a （被）加数
 * @param {number} b 加数
 * @param {number} [decimals=0] 精确小数位个数
 * @returns {number}  结果
 */
export function add (a, b, decimals = 0) {
  return round((a + b) * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * 真·四舍五入
 *
 * @param {number} num 目标数值
 * @param {number} decimals 精确小数位个数
 * @returns {number}  结果
 */
export function round (num, decimals = 0) {
  return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals)
}

/**
 * 以 10 为底数取对数
 *
 * @param {number} num 真数
 * @returns {number} 对数
 */
export function log10 (num) {
  return Math.log10 ? Math.log10(num) : Math.log(num) * Math.LOG10E
}

export function resolveOffset (val, base) {
  let isPx = isString(val) && /px$/.test(val)
  let num = isPx ? +val.replace(/px$/, '') : val || 0
  return base == null ? num : isPx ? num : base * num
}
