import carousel from '../../mixins/carousel'
import prefix from '../../mixins/prefix'

export default {
  mixins: [prefix, carousel],
  props: {
    aspectRatio: String
  },
  computed: {
    aspectRatioStyle () {
      if (this.aspectRatio) {
        const [w, h] = this.aspectRatio.split(':').map(Number)
        const ratio = `${(h / w) * 100}%`
        return { 'padding-top': ratio }
      }
      return null
    }
  }
}
