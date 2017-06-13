<template>
  <div id="app" :class="{'console-expanded': console.expanded}">
    <nav id="main-nav">
      <h1>VEUI components</h1>
      <ul>
        <li v-for="route in routes"><router-link :to='route'>{{route.name}}</router-link></li>
      </ul>
      <footer>© {{year}} Baidu, Inc.</footer>
    </nav>
    <main id="content">
      <router-view></router-view>
    </main>
    <aside id="console">
      <h2 @click="console.expanded = !console.expanded">
        <icon @click.native.stop="console.logs = []" name="ban" label="Clear console" flip="horizontal"></icon>
        <icon :name="console.expanded ? 'caret-down' : 'caret-up'" label="Toggle console"></icon>
        Console <small>({{console.logs.length}})</small>
      </h2>
      <section class="output" ref="logList">
        <pre class="log" v-for="log in console.logs"><template v-if="log != null"><div v-if="log instanceof String">{{log}}</div><div class="line" v-else v-for="line in log" v-html="format(line)"></div></template><template v-else v-html="format(log)"></template></pre>
      </section>
    </aside>
  </div>
</template>

<script>
import routes from './cases'
import bus from './bus'
import 'vue-awesome/icons/caret-up'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/ban'

export default {
  name: 'app',
  data () {
    return {
      routes,
      console: {
        logs: [],
        expanded: false
      },
      year: (new Date()).getFullYear()
    }
  },
  methods: {
    log (...messages) {
      console.log(...messages)
      this.console.logs.push(messages)
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
  mounted () {
    bus.$on('log', (...messages) => this.log(...messages))
  }
}
</script>

<style lang="less">
@import "../src/styles/theme-default/common.less";

@nav-width: 240px;
@light-bg-color: #f6f9ff;
@console-height: 40vh;
@title-height: 30px;

#app {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  &.console-expanded {
    .output {
      overflow: auto;
      height: @console-height;
    }

    main {
      height: ~"calc(100vh - @{console-height} - @{title-height})";
    }
  }
}

#main-nav,
#console {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

#main-nav {
  .absolute(0, _, 0, 0);
  width: @nav-width;
  border-right: 1px solid #eee;
  font-weight: 300;

  h1 {
    .centered-line(60px);
    border-bottom: 1px solid #eee;
    margin: 0;
    padding: 0 24px;
    font-size: 18px;
  }

  ul {
    height: ~"calc(100vh - 105px)";
    margin: 0;
    padding: 0;
    overflow: auto;
  }

  li {
    a {
      display: block;
      padding: .5em 24px;
      text-decoration: none;
      color: @veui-gray-color-weak;
      outline: none;
      line-height: 2;
    }
  }

  .router-link-active {
    color: @veui-theme-color-primary;
    background-color: @light-bg-color;
    font-weight: 600;
  }

  footer {
    border-top: 1px solid #eee;
    color: @veui-gray-color-weak;
    font-size: 12px;
    line-height: 45px;
    padding-left: 24px;
  }
}

main {
  .absolute(0, 0, 0, @nav-width);
  overflow: scroll;
  padding: 1em 4em 0;
  height: ~"calc(100vh - @{title-height})";
  transition: height .2s;

  h1 {
    border-bottom: 1px solid #eee;
    margin-bottom: 2em;
    padding-bottom: 1em;
    font-size: 18px;
  }
}

#console {
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
}

.fa-icon {
  width: auto;
  height: 1em;
}
</style>
