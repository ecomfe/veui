import { throttle, uniqueId } from 'lodash'
import { toggleClass } from '../utils/dom'
import outside from '../directives/outside'
import overlay from './overlay'
import activatable from './activatable'
import useControllable from './controllable'
// import config from '../managers/config'

const baseMixin = {
  directives: { outside },
  mixins: [
    overlay,
    activatable,
    useControllable([
      {
        prop: 'expanded',
        event: 'toggle'
      }
    ])
  ],
  props: {
    overlayPriority: Number,
    expanded: Boolean
  },
  data () {
    return {
      localOverlayOptions: {
        position: 'bottom-start'
      },
      dropdownId: uniqueId('veui-dropdown-')
    }
  },
  updated () {
    let { box } = this.$refs
    if (!box || !(box instanceof HTMLElement)) {
      return
    }

    if (box.scrollHeight > box.offsetHeight) {
      toggleClass(box, 'veui-dropdown-overflow', true)

      if (!box.__overlay_scroll_handler__) {
        box.__overlay_scroll_handler__ = this.__overlay_scroll_handler__ = throttle(
          this.handleScroll,
          200,
          {
            leading: true
          }
        )
        box.addEventListener('scroll', this.__overlay_scroll_handler__, false)
      }

      this.handleScroll()
    }
  },
  methods: {
    close () {
      this.commit('expanded', false)
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.commit('expanded', true)
    },
    handleScroll () {
      let { box } = this.$refs

      if (!box) {
        return
      }

      toggleClass(
        box,
        'veui-dropdown-overflow-scroll-start',
        box.scrollTop === 0
      )

      toggleClass(
        box,
        'veui-dropdown-overflow-scroll-end',
        box.scrollTop + box.offsetHeight >= box.scrollHeight
      )
    }
  },
  destroy () {
    let { box } = this.$refs

    if (!box) {
      return
    }

    if (this.__overlay_scroll_handler__) {
      box.removeEventListener('scroll', this.__overlay_scroll_handler__, false)
      box.__overlay_scroll_handler__ = null
    }
  }
}

export default function dropdown () {
  // 先保留 mixin factory 的写法吧
  return baseMixin
  // if (!maxCount) {
  //   return baseMixin
  // }

  // return {
  //   ...baseMixin,
  //   computed: {
  //     ...(baseMixin.computed || {}),
  //     overlayStyleWithMaxDisplayCount () {
  //       const name =
  //         ns || this.$options.name.replace(/(?:^veui)?-/g, '').toLowerCase()
  //       return this.mergeOverlayStyle({
  //         '--dls-dropdown-max-display-count': config.get(`${name}.maxCount`)
  //       })
  //     }
  //   }
  // }
}
