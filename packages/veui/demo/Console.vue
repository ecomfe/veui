<template>
<aside
  :class="{
    expanded,
    'veui-console': true
  }"
>
  <h2 @click="expanded = !expanded">
    <icon
      name="ban"
      label="Clear console"
      flip="horizontal"
      @click.native.stop="logs = []"
    />
    <icon
      :name="expanded ? 'chevron-down' : 'chevron-up'"
      label="Toggle console"
    />
    Console <small>({{ logs.length }})</small>
  </h2>
  <section
    ref="logList"
    class="output"
  >
    <pre
      v-for="(logItem, index) in logs"
      :key="`log-${index}`"
      class="log"
    ><template v-if="logItem != null"><div v-if="typeof logItem === 'string'">{{ logItem }}</div><div
      v-for="(line, i) in logItem"
      v-else
      :key="`line-${i}`"
      class="line"
      v-html="format(line)"
    /></template><template
      v-else
      v-html="format(log)"
    /></pre>
  </section>
</aside>
</template>

<script>
import bus from './bus'
import Icon from 'veui/components/Icon'
import 'vue-awesome/icons/ban'
import 'veui-theme-dls-icons/chevron-up'
import 'veui-theme-dls-icons/chevron-down'

export default {
  name: 'veui-console',
  components: {
    Icon
  },
  data () {
    return {
      expanded: false,
      logs: []
    }
  },
  watch: {
    expanded (value) {
      document.body.classList.toggle('console-expanded', value)
    }
  },
  mounted () {
    bus.$on('log', (...messages) => this.log(...messages))
  },
  methods: {
    log (...messages) {
      console.log(...messages)
      this.logs.push(messages)
      let el = this.$refs.logList
      this.$nextTick(() => {
        el.scrollTop = el.scrollHeight
      })
    },
    format (text) {
      if (text != null) {
        return text
      }
      return `<span style="color: #ccc">${
        text === '' ? 'empty' : String(text)
      }</span>`
    }
  }
}
</script>

<style lang="less">
@import "~less-plugin-est/src/all.less";

@nav-width: 240px;
@light-bg-color: #f6f9ff;
@title-height: 30px;
@console-height: 40vh;

.veui-console {
  position: fixed;
  right: 0;
  bottom: 0;
  left: @nav-width;
  background-color: #fff;

  h2 {
    .centered-line(@title-height);
    margin: 0;
    padding: 0 1em;
    background-color: @light-bg-color;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    cursor: pointer;

    & > * {
      margin-right: 5px;
    }

    .veui-icon {
      vertical-align: middle;
    }

    small {
      margin-left: 3px;
    }
  }

  .output {
    overflow: hidden;
    height: 0;
    margin: 0;
    line-height: 20px;
    font-size: 10px;
    transition: height 0.2s;

    .log {
      position: relative;
      min-height: 20px;
      margin: 0;
      padding: 0 1em;
      border-bottom: 1px solid #f3f3f3;

      .line:not(:last-child) {
        border-bottom: 1px solid #f3f3f3;
      }

      &:last-child::before {
        content: "";
        .absolute(0, _, 0, 0);
        width: 2px;
        background-color: #369;
      }
    }
  }

  small {
    color: #999;
  }

  &.expanded {
    .output {
      overflow: auto;
      height: @console-height;
    }
  }
}
</style>
