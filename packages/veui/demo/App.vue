<template>
  <div id="app">
    <nav id="main-nav">
      <h1><a href="https://github.com/ecomfe/veui">VEUI components</a><icon name="brands/github" scale="6"></icon></h1>
      <ul>
        <li v-for="(route, index) in routes" :key="index"><router-link :to='route'>{{route.name}}</router-link></li>
      </ul>
      <footer><a href="https://www.baidu.com/" target="_blank">© {{year}} Baidu, Inc.</a><icon name="baidu" scale="8"></icon></footer>
    </nav>
    <main id="content">
      <router-view></router-view>
    </main>
    <console id="console"></console>
  </div>
</template>

<script>
import routes from './cases'
import Console from './Console'
import Icon from '@/components/Icon'
import 'vue-awesome/icons/ban'
import 'vue-awesome/icons/brands/github'

Icon.register({
  baidu: {
    width: 23.868,
    height: 26,
    d: 'M3.613 13.701c2.827-.608 2.442-3.986 2.357-4.725-.138-1.139-1.477-3.128-3.296-2.971C.386 6.21.052 9.515.052 9.515c-.309 1.528.74 4.793 3.561 4.186zm3.002 5.875c-.083.238-.268.846-.107 1.375.315 1.187 1.346 1.24 1.346 1.24h1.48v-3.619H7.749c-.713.213-1.057.767-1.134 1.004zM8.86 8.035c1.562 0 2.823-1.797 2.823-4.019C11.683 1.796 10.421 0 8.86 0 7.301 0 6.036 1.796 6.036 4.016c0 2.222 1.265 4.019 2.824 4.019zm6.724.265c2.087.271 3.429-1.956 3.695-3.644.272-1.686-1.074-3.644-2.552-3.98-1.48-.339-3.329 2.032-3.497 3.578-.2 1.89.271 3.778 2.354 4.046zm5.114 9.923s-3.229-2.498-5.113-5.198c-2.555-3.981-6.185-2.361-7.399-.337-1.209 2.024-3.093 3.305-3.36 3.644-.271.334-3.9 2.293-3.095 5.871.806 3.576 3.635 3.508 3.635 3.508s2.085.205 4.504-.336c2.42-.537 4.503.134 4.503.134s5.652 1.893 7.199-1.751c1.545-3.645-.874-5.535-.874-5.535zm-9.671 5.423H7.352c-1.587-.316-2.219-1.4-2.299-1.584-.078-.188-.528-1.059-.29-2.539.686-2.219 2.642-2.379 2.642-2.379h1.956V14.74l1.666.025v8.881zm6.844-.025h-4.229c-1.639-.423-1.716-1.587-1.716-1.587v-4.677l1.716-.027v4.203c.104.447.661.529.661.529h1.742v-4.705h1.825v6.264zm5.986-12.486c0-.808-.671-3.239-3.159-3.239-2.492 0-2.825 2.295-2.825 3.917 0 1.548.131 3.71 3.227 3.641 3.096-.068 2.757-3.507 2.757-4.319z'
  }
})

export default {
  name: 'app',
  components: {
    Console,
    Icon
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
@import "~less-plugin-est/src/all.less";
@import "~veui-theme-one/common.less";

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
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid #eee;
    margin: 0;
    font-size: 18px;

    a {
      display: block;
      width: 100%;
      padding: 0 24px;
      color: #333;
      text-decoration: none;
    }

    .veui-icon {
      position: absolute;
      opacity: .05;
      z-index: -1;
      top: -25px;
      right: -5px;
      transition: transform .6s;
    }

    &:hover {
      .veui-icon {
        transform: scale(0.8);
        opacity: .1;
      }
    }
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
      color: #999;
      outline: none;
      line-height: 2;

      &:hover {
        font-weight: 500;
      }
    }
  }

  .router-link-active {
    color: #3998fc;
    background-color: @light-bg-color;
    font-weight: 500;
  }

  footer {
    position: relative;
    overflow: hidden;
    border-top: 1px solid #eee;
    font-size: 12px;

    a {
      display: block;
      width: 100%;
      padding-left: 24px;
      line-height: 45px;
      color: #999;
      text-decoration: none;
    }

    .veui-icon {
      position: absolute;
      opacity: .05;
      z-index: -1;
      top: -36px;
      right: -5px;
      transition: transform .3s ease-in-out;
    }

    &:hover {
      .veui-icon {
        transform: translateY(10px) scale(0.3);
        opacity: .1;
      }
    }
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
</style>
