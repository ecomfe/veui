<template>
<aside :class="{expanded, 'veui-console': true}">
  <h2 @click="expanded = !expanded">
    <icon @click.native.stop="logs = []" name="cross" label="Clear console"></icon>
    <icon :name="expanded ? 'triangle-down' : 'triangle-up'" label="Toggle console"></icon>
    Console <small>({{logs.length}})</small>
  </h2>
  <section class="output" ref="logList">
    <pre class="log" v-for="(log, index) in logs" :key="index"><template v-if="log != null"><div v-if="log instanceof String">{{log}}</div><div class="line" v-else v-for="line in log" v-html="format(line)"></div></template><template v-else v-html="format(log)"></template></pre>
  </section>
</aside>
</template>

<script>
import bus from './bus'
import Icon from 'veui/components/Icon'

export default {
  components: {
    Icon
  },
  data () {
    return {
      expanded: false,
      logs: []
    }
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
      return `<span style="color: #ccc">${text === '' ? 'empty' : String(text)}</span>`
    }
  },
  watch: {
    expanded (value) {
      document.body.classList.toggle('console-expanded', value)
    }
  },
  mounted () {
    bus.$on('log', (...messages) => this.log(...messages))
  }
}
</script>

<style lang="less">
@import "~veui-theme-dux/common.less";

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
    color: @veui-gray-color-normal;
    cursor: pointer;

    & > * {
      margin-right: 5px;
    }

    .fa-icon {
      transform: translateY(2px);
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
    transition: height .2s;

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
        background-color: @veui-theme-color-primary;
      }
    }
  }

  small {
    color: @veui-gray-color-weak;
  }

  &.expanded {

    .output {
      overflow: auto;
      height: @console-height;
    }
  }
}
</style>
