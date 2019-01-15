import tinycolor from 'tinycolor2'

export function formatColor (color, {
  precision = 4,
  format = 'hsl'
} = {}) {
  color = tinycolor(color)
  switch (format) {
    case 'rgb':
      return color.toRgbString()

    case 'hex':
      return color.toHexString()

    case 'hsl':
    default:
      // 因为 tinycolor 的 toHslString() 得到的颜色没有小数
      // 精度丢失会导致数字修改时突变，所以自己实现一个format保留4位小数
      return formatHsla(color.toHsl())
  }
}

/**
 * 格式化 hsla
 *
 * @param  {Number} color.h         Hue
 * @param  {Number} color.s         Saturation
 * @param  {Number} color.l         Lightness
 * @param  {Number} color.a         Alpha
 * @param  {Number} options.precision precision
 * @return {String}
 */
export function formatHsla ({h, s, l, a}, {precision = 4} = {}) {
  precision = Math.pow(10, precision)
  h = Math.round(h % 360 * precision) / precision
  s = Math.round(s * 100 * precision) / precision
  l = Math.round(l * 100 * precision) / precision
  a = Math.round(a * precision) / precision
  return a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${a})`
}
