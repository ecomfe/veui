<template>
<article>
  <h1>
    <code>&lt;veui-stack&gt;</code>
  </h1>
  <section>
    <veui-rating clearable :labels="labels"/>
  </section>
  <section>
    <veui-rating clearable allow-half :labels="labels"/>
  </section>
  <section>
    <veui-rating readonly :max="3" :value="2" :labels="labels"/>
  </section>
</article>
</template>

<script>
import { Rating } from 'veui'

export default {
  name: 'rating-demo',
  components: {
    'veui-rating': Rating
  },
  data () {
    return {
      labels: {
        1: '很差',
        1.5: '差',
        2: '较差',
        2.5: '一般',
        3: '还行',
        3.5: '好',
        4: '很好',
        4.5: '非常好',
        5: '极好'
      }
    }
  }
}
</script>

<style scoped>
section + section {
  margin-top: 20px;
}
</style>
