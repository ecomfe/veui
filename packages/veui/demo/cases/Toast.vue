<template>
<article>
  <h1>
    <code>&lt;veui-toast&gt;</code>
  </h1>
  <section>
    <h3>全局提示</h3>
    <veui-button
      class="button"
      ui="aux"
      @click="showToast('all')"
    >全部</veui-button>
    <veui-button
      class="button"
      ui="aux"
      @click="showToast('success')"
    >成功</veui-button>
    <veui-button
      class="button"
      ui="aux"
      @click="showToast('warn')"
    >警告</veui-button>
    <veui-button
      class="button"
      ui="aux"
      @click="showToast('info')"
    >提醒</veui-button>
    <veui-button
      class="button"
      ui="aux"
      @click="showToast('error')"
    >错误</veui-button>
    <veui-button
      class="button"
      ui="aux"
      @click="showSlottedToast"
    >错误（包括组件）</veui-button>
  </section>

  <section>
    <h4>关闭</h4>

    <veui-button
      class="button"
      ui="aux"
      @click="showCloseToast"
    >打开</veui-button>
    <veui-button
      class="button"
      :disabled="!closeToast"
      ui="aux"
      @click="closeCloseToast"
    >关闭</veui-button>
  </section>

  <h4>样式</h4>
  <section class="col">
    <section>
      <veui-toast class="toast" open>Test</veui-toast>
    </section>
    <section>
      <veui-toast
        class="toast"
        open
        closable
        status="warning"
      >Test</veui-toast>
    </section>
    <section>
      <veui-toast class="toast" open closable status="error">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolores,
        sint harum aspernatur aliquid sed maxime dolorum qui recusandae
        voluptatem. Saepe dolorem placeat culpa nisi eligendi ipsam illo non
        quam.
      </veui-toast>
    </section>
    <section>
      <veui-toast class="toast" open title="Lorem Ipsum" status="info">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At
        laboriosam, atque cumque sequi, debitis impedit fugit vitae iure,
        rerum accusantium odio porro. Exercitationem excepturi adipisci unde
        maiores est! Eos, consequatur.
      </veui-toast>
    </section>
    <section>
      <veui-toast class="toast" open title="Lorem Ipsum" closable>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
        minima doloremque quaerat consequatur accusamus repellat eum? Dolorem
        sunt est, sint inventore, id atque ut aspernatur ipsa corrupti debitis
        quaerat voluptatibus!
      </veui-toast>
    </section>
  </section>
  <section class="col">
    <section>
      <veui-toast class="toast" ui="s" open>Test</veui-toast>
    </section>
    <section>
      <veui-toast
        class="toast"
        ui="s"
        open
        closable
        status="warning"
      >Test</veui-toast>
    </section>
    <section>
      <veui-toast class="toast" ui="s" open closable status="error">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolores,
        sint harum aspernatur aliquid sed maxime dolorum qui recusandae
        voluptatem. Saepe dolorem placeat culpa nisi eligendi ipsam illo non
        quam.
      </veui-toast>
    </section>
    <section>
      <veui-toast class="toast" ui="s" open title="Lorem Ipsum" status="info">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At
        laboriosam, atque cumque sequi, debitis impedit fugit vitae iure,
        rerum accusantium odio porro. Exercitationem excepturi adipisci unde
        maiores est! Eos, consequatur.
      </veui-toast>
    </section>
    <section>
      <veui-toast class="toast" ui="s" open title="Lorem Ipsum" closable>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
        minima doloremque quaerat consequatur accusamus repellat eum? Dolorem
        sunt est, sint inventore, id atque ut aspernatur ipsa corrupti debitis
        quaerat voluptatibus!
      </veui-toast>
    </section>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Button, Toast, Link } from 'veui'
import toast from 'veui/managers/toast'

let messages = [
  {
    status: 'success',
    message: '恭喜您，您的请求已成功处理',
    duration: 2500
  },
  {
    status: 'warn',
    message: '警告，有法律风险存在',
    duration: 2000
  },
  {
    status: 'info',
    message: '提醒，请注意这个消息',
    duration: 1500
  },
  {
    status: 'error',
    message: '错误，请检查并修改后再提交',
    duration: 1000
  }
]

export default {
  name: 'toast',
  components: {
    'veui-button': Button,
    'veui-toast': Toast
  },
  data () {
    return {
      messages,
      closeToast: null
    }
  },
  computed: {
    messageMap () {
      return this.messages.reduce((result, current) => {
        result[current.status] = current
        return result
      }, {})
    }
  },
  mounted () {
    this.$children.forEach((child) => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    showToast (status) {
      if (status === 'all') {
        messages.forEach(({ status, message, duration }) => {
          toast[status]({
            message,
            title: '测试title',
            closable: true,
            duration
          })
        })
      } else {
        toast[status](this.messageMap[status].message)
      }
    },
    showSlottedToast () {
      const h = this.$createElement
      toast.error({
        message: ({ close }) => [
          '错误，请检查并修改后再提交',
          h(Link, { props: { ui: 'strong' }, on: { click: close } }, '去修改')
        ],
        duration: 100000
      })
    },
    showCloseToast () {
      if (this.closeToast) {
        return
      }
      this.closeToast = toast.info({
        message: '点击“关闭”按钮关闭本条提示',
        duration: -1,
        closable: false
      })
    },
    closeCloseToast () {
      this.closeToast()
      this.closeToast = null
    }
  }
}
</script>

<style lang="less" scoped>
section {
  & + & {
    margin-top: 20px;
  }
}

.col {
  float: left;

  & + & {
    margin-left: 20px;
  }
}

h3 {
  margin-bottom: 30px;
}

h4 {
  margin-top: 2em;
}

.button {
  & + & {
    margin-left: 10px;
  }
}

.toast {
  position: relative;
}
</style>
