import { uniqueId, pull, findLastIndex } from 'lodash'
import { walk } from '../utils/datasource'
import config from './config'

let nodeIndex = {}

/**
 * Retrieve a node by id if given a string, otherwise return the given value
 *
 * @param {OverlayNode|string} node the node or its id
 */
function getNode (node) {
  if (typeof node === 'string') {
    node = nodeIndex[node]

    if (!node) {
      throw new Error(`The given node id doesn't exist!`)
    }
  }

  return node
}

class OverlayNode {
  id = uniqueId('overlay-node-id-')

  /**
   * Parent node
   *
   * @public
   * @type {?OverlayNode}
   */
  parent = null

  /**
   * Child nodes
   *
   * @public
   * @type {Array<OverlayNode>}
   */
  children = []

  /**
   * Order
   *
   * @private
   * @type {?number}
   */
  _order = null

  /**
   * Priority
   *
   * @public
   * @type {?number}
   */
  priority = null

  /**
   * Order change callback
   *
   * @public
   * @type {function(number)}
   */
  onOrderChange = null

  /**
   * Reference to the root node
   *
   * @public
   * @type {OverlayNode}
   */
  root = null

  /**
   * Constructing a node
   *
   * @constructor
   */
  constructor (root = null, parent = root, priority = 1) {
    this.root = root
    this.parent = parent
    this.priority = priority
    nodeIndex[this.id] = this
  }

  /**
   * Order
   *
   * @public
   * @type {?number}
   */
  get order () {
    return this._order
  }

  /**
   * Order
   *
   * @public
   * @type {?number}
   */
  set order (val) {
    if (this._order !== val) {
      this._order = val

      if (typeof this.onOrderChange === 'function') {
        this.onOrderChange(val)
      }
    }
  }

  /**
   * Append current node into the children of another node
   *
   * @param {OverlayNode} parent the parent overlay node
   */
  appendTo (parent) {
    parent = getNode(parent) || this.root

    parent.append(this)
    this.root.reorder()
  }

  /**
   * Append the given node into the children of current node
   *
   * @param {OverlayNode} node the node to be appended
   */
  append (node) {
    node = getNode(node)

    let { children } = this

    if (node.parent) {
      pull(node.parent.children, node)
    }

    let index = findLastIndex(
      children,
      ({ priority }) => priority <= node.priority
    )

    // not found: -1 so insert at 0
    children.splice(index + 1, 0, node)
    node.parent = this
  }

  /**
   * Move current node to the end of siblings with the same priority
   */
  toTop () {
    this.appendTo(this.parent)
  }

  /**
   * Remove current node
   */
  remove () {
    if (this.parent) {
      pull(this.parent.children, this)
    }
    this.children.forEach(node => node.remove())
    this.root = this.parent = null
    delete nodeIndex[this.id]
  }
}

export class OverlayManager {
  /**
   * The root node
   *
   * @type {OverlayNode}
   */
  root = new OverlayNode()

  /**
   * The base order
   *
   * @type {number}
   */
  baseOrder = 100

  /**
   * Constructing a manager
   *
   * @constructor
   */
  constructor ({ baseOrder } = {}) {
    if (baseOrder != null) {
      this.baseOrder = baseOrder
    }
    this.root.reorder = this.reorder.bind(this)
  }

  /**
   * Sets the base order and reorder the whole tree (if necessary)
   *
   * @param {number} order the base order
   */
  setBaseOrder (order) {
    if (this.baseOrder !== order) {
      this.baseOrder = order
      this.reorder()
    }
  }

  /**
   * Create an overlay node and attach it to a given parent
   *
   * @param {Object} options the option bag
   * @param {number} priority the priority of the node
   * @param {OverlayManager} options.parent the parent node
   * @param {function(number)} options.onOrderChange the callback called after order is changed
   * @param {string} options.parentId the id of parent node if `parent` isn't specified (for backward-compatibility only, not recommended)
   * @param {function(number)} options.orderChangeCallback the alias for `onOrderChange` (for backward-compatibility only, not recommended)
   */
  createNode (options = {}) {
    let {
      parent,
      parentId,
      priority,
      onOrderChange,
      orderChangeCallback
    } = options

    let node = new OverlayNode(this.root, this.root, priority)

    node.onOrderChange = onOrderChange || orderChangeCallback
    node.appendTo(parent || parentId || this.root)

    return node
  }

  /**
   * Update the order of the whole tree
   */
  reorder () {
    let nodes = []

    walk(this.root.children, node => {
      nodes.push(node)
    })

    let { baseOrder } = this
    nodes.forEach((node, i) => {
      node.order = baseOrder + i
    })
  }
}

let defaultManager = new OverlayManager()
config.defaults('managers.overlay', defaultManager)

export default defaultManager
