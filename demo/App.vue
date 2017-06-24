<template>
  <div id="app">
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
    <console id="console"/>
  </div>
</template>

<script>
import routes from './cases'
import Console from './Console'
import 'vue-awesome/icons/ban'

export default {
  name: 'app',
  components: {
    Console
  },
  data () {
    return {
      routes,
      year: (new Date()).getFullYear()
    }
  }
}
</script>

<style lang="less">
@import "../src/styles/theme-default/common.less";

@nav-width: 240px;
@light-bg-color: #f6f9ff;
@title-height: 30px;
@console-height: 40vh;

#app {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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

  .console-expanded & {
    height: ~"calc(100vh - @{console-height} - @{title-height})";
  }
}

#console {
  position: fixed;
  right: 0;
  bottom: 0;
  left: @nav-width;
}


.fa-icon {
  width: auto;
  height: 1em;
}
</style>
