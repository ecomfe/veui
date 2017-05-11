import { isArray, isString } from 'lodash'

/**
 * 根据ref拿到指定的DOM节点，主要有一下情况：
 * 1、如果ref是字符串，就需要从context下面找指定ref的组件实例或者DOM元素；
 * 2、如果ref直接就是组件实例，那就取ref.$el；
 * 3、如果ref直接就是文本节点或者元素节点，就返回ref。
 * 4、否则返回null
 *
 * @param {string|VueComponent|Node} ref 目标节点标识
 * @param {VueContext=} context 组件上下文，在ref为字符串的时候必传
 * @return {Node}
 */
export function getNodes (ref, context) {
  if (!ref) {
    return []
  }

  let targetNodes
  if (isString(ref)) {
    targetNodes = context.$refs[ref]
    targetNodes = isArray(targetNodes) ? targetNodes : [targetNodes]
    targetNodes = targetNodes.map((item) => {
      return item.$el || item
    })
  } else if (ref.$el) {
    // 组件
    targetNodes = [ref.$el]
  } else if (ref.nodeType === 1 || ref.nodeType === 3) {
    // dom元素节点和文本节点
    targetNodes = [ref]
  }
  return targetNodes || []
}
