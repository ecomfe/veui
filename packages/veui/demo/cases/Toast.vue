<template>
<article>
  <h1>
    <code>&lt;veui-toast&gt;</code>
  </h1>
  <section>
    <h3>全局提示</h3>
    <veui-button
      ui="aux"
      @click="showToast('all')"
    >全部</veui-button>
    <veui-button
      ui="aux"
      @click="showToast('success')"
    >成功</veui-button>
    <veui-button
      ui="aux"
      @click="showToast('warn')"
    >警告</veui-button>
    <veui-button
      ui="aux"
      @click="showToast('info')"
    >提醒</veui-button>
    <veui-button
      ui="aux"
      @click="showToast('error')"
    >错误</veui-button>
    <veui-button
      ui="aux"
      @click="showSlottedToast"
    >错误（包括组件）</veui-button>
  </section>
  <section class="col">
    <section>
      <veui-toast open>Test</veui-toast>
    </section>
    <section>
      <veui-toast
        open
        closable
        type="warning"
      >Test</veui-toast>
    </section>
    <section>
      <veui-toast
        open
        closable
        type="error"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolores,
        sint harum aspernatur aliquid sed maxime dolorum qui recusandae
        voluptatem. Saepe dolorem placeat culpa nisi eligendi ipsam illo non
        quam.
      </veui-toast>
    </section>
    <section>
      <veui-toast
        open
        title="Lorem Ipsum"
        type="info"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At
        laboriosam, atque cumque sequi, debitis impedit fugit vitae iure,
        rerum accusantium odio porro. Exercitationem excepturi adipisci unde
        maiores est! Eos, consequatur.
      </veui-toast>
    </section>
    <section>
      <veui-toast
        open
        title="Lorem Ipsum"
        closable
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
        minima doloremque quaerat consequatur accusamus repellat eum? Dolorem
        sunt est, sint inventore, id atque ut aspernatur ipsa corrupti debitis
        quaerat voluptatibus!
      </veui-toast>
    </section>
  </section>
  <section class="col">
    <section>
      <veui-toast
        ui="s"
        open
      >Test</veui-toast>
    </section>
    <section>
      <veui-toast
        ui="s"
        open
        closable
        type="warning"
      >Test</veui-toast>
    </section>
    <section>
      <veui-toast
        ui="s"
        open
        closable
        type="error"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolores,
        sint harum aspernatur aliquid sed maxime dolorum qui recusandae
        voluptatem. Saepe dolorem placeat culpa nisi eligendi ipsam illo non
        quam.
      </veui-toast>
    </section>
    <section>
      <veui-toast
        ui="s"
        open
        title="Lorem Ipsum"
        type="info"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At
        laboriosam, atque cumque sequi, debitis impedit fugit vitae iure,
        rerum accusantium odio porro. Exercitationem excepturi adipisci unde
        maiores est! Eos, consequatur.
      </veui-toast>
    </section>
    <section>
      <veui-toast
        ui="s"
        open
        title="Lorem Ipsum"
        closable
      >
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
    type: 'success',
    message: '恭喜您，您的请求已成功处理',
    duration: 2500
  },
  {
    type: 'warn',
    message: '警告，有法律风险存在',
    duration: 2000
  },
  {
    type: 'info',
    message: '提醒，请注意这个消息',
    duration: 1500
  },
  {
    type: 'error',
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
      messages: messages
    }
  },
  computed: {
    messageMap () {
      return this.messages.reduce((result, current) => {
        result[current.type] = current
        return result
      }, {})
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    showToast (type) {
      if (type === 'all') {
        messages.forEach(({ type, message, duration }) => {
          toast[type]({
            message,
            title: '测试title',
            closable: true,
            duration
          })
        })
      } else {
        toast[type](this.messageMap[type].message)
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

.veui-button {
  & + & {
    margin-left: 10px;
  }
}

.veui-toast {
  position: relative;
}
</style>
