<template>
<article class="demo-dialog">
  <h1><code>&lt;veui-dialog&gt;</code></h1>
  <section>
    <veui-dialog
      overlay-class="test demo-dialog-standard-dialog"
      :open.sync="modalDialogVisible"
      title="Dialog Title"
      modal
    >
      <p>content area</p>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="modalDialogVisible = !modalDialogVisible"
    >
      Open a modal dialog box
    </veui-button>

    <veui-dialog
      overlay-class="test demo-dialog-standard-dialog"
      :open.sync="fullscreenDialogVisible"
      title="Dialog Title"
      modal
      ui="fullscreen"
    >
      <p>content area</p>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="fullscreenDialogVisible = !fullscreenDialogVisible"
    >
      Open a fullscreen dialog box
    </veui-button>

    <veui-dialog
      overlay-class="test demo-dialog-standard-dialog auto-dialog-standard-dialog"
      :open.sync="autoDialogVisible"
      modal
      outside-closable
      ui="auto"
      footless
    >
      <textarea class="resizable"/>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="autoDialogVisible = !autoDialogVisible"
    >
      Open an footless dialog box with auto dimension
    </veui-button>
  </section>
  <section>
    <veui-dialog
      overlay-class="test demo-dialog-standard-dialog"
      :open.sync="titlelessDialogVisible"
    >
      <p>content area</p>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="titlelessDialogVisible = !titlelessDialogVisible"
    >
      Open a titleless dialog box
    </veui-button>

    <veui-dialog
      :modal="false"
      :open.sync="nonModalDialogVisible"
      ui="auto"
      :before-close="beforeClose"
      title="Dialog Title"
    >
      The content of the Dialog. You can use the default slot to override it.
      <template
        slot="foot"
        slot-scope="{ close }"
      >
        <veui-button
          ui="primary"
          :loading="loading"
          @click="close('ok')"
        >
          OK
        </veui-button>
        <veui-button
          autofocus
          @click="close"
        >
          CANCEL
        </veui-button>
      </template>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="nonModalDialogVisible = !nonModalDialogVisible"
    >
      Open a modaless dialog box
    </veui-button>
  </section>
  <section>
    <veui-dialog
      :modal="false"
      :open.sync="draggableDialog1Visible"
      ui="narrow s"
      title="First"
      draggable
    >
      You can drag the dialog box in the viewport.
      <template
        slot="foot"
        slot-scope="{ close }"
      >
        <veui-button
          ui="primary"
          @click="close('ok')"
        >
          OK
        </veui-button>
        <veui-button
          autofocus
          @click="close"
        >
          CANCEL
        </veui-button>
      </template>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="draggableDialog1Visible = !draggableDialog1Visible"
    >
      Open the first draggable dialog box
    </veui-button>

    <veui-dialog
      :modal="false"
      :open.sync="draggableDialog2Visible"
      title="Second"
      ui="medium"
      draggable
    >
      <div>
        Drag the current dialog box to the right and open the first draggable
        dialog.
      </div>
      <div>Keep the two dialog have some parts overlapped.</div>
      <div>
        You'll see the first draggable dialog is higher than the second one.
      </div>
      <div>
        You can bring the second dialog to the top layer by clicking the
        second dialog.
      </div>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="draggableDialog2Visible = !draggableDialog2Visible"
    >
      Open the second draggable dialog box
    </veui-button>

    <veui-dialog
      ref="resetDialog"
      :modal="false"
      :open.sync="draggableDialog3Visible"
      title="Reset Position"
      ui="wide"
      draggable
    >
      Click the `reset` button to put the dialog to the initial position.
      <template slot="foot">
        <veui-button
          ui="alt"
          @click="() => $refs.resetDialog.resetPosition()"
        >
          Reset
        </veui-button>
      </template>
    </veui-dialog>
    <veui-button
      ui="alt"
      @click="draggableDialog3Visible = !draggableDialog3Visible"
    >
      Draggable dialog box with reset button
    </veui-button>
  </section>
  <section>
    <veui-dialog
      :open.sync="operationDialogVisible"
      title="The Built-in Button"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      The two built-in buttons emit their own event when clicked.
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="operationDialogVisible = true"
    >
      The Built-in Button
    </veui-button>
  </section>
  <section>
    <veui-dialog
      :open.sync="customTextTitleDialogVisible"
      title="Custom Title"
    >
      You can change the dialog title text by setting the `title` prop or
      passing in the `title` slot parameter.
      <template slot="foot">
        <veui-button
          ui="primary"
          @click="customTextTitleDialogVisible = false"
        >
          OK
        </veui-button>
        <veui-button
          autofocus
          @click="customTextTitleDialogVisible = false"
        >
          CANCEL
        </veui-button>
      </template>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="customTextTitleDialogVisible = true"
    >
      Custom Title
    </veui-button>

    <veui-dialog :open.sync="customIconTitleDialogVisible">
      <template slot="title">
        Custom Title With ICON <veui-icon
          class="svg"
          name="calendar"
        />
      </template>
      <template slot="foot">
        <veui-button
          ui="primary"
          @click="customIconTitleDialogVisible = false"
        >
          OK
        </veui-button>
        <veui-button
          autofocus
          @click="customIconTitleDialogVisible = false"
        >
          CANCEL
        </veui-button>
      </template>
      You can add icons to title by the `title slot`.
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="customIconTitleDialogVisible = true"
    >
      Custom Title With ICON
    </veui-button>
  </section>

  <section>
    <veui-dialog
      :open.sync="contentAutoHeightDialogVisible"
      title="Adaptive Content Height"
    >
      <p>
        The following increaming content string will incream the content
        height slowly:
      </p>
      <div v-html="dynamicContent"/>
      <template slot="foot">
        <veui-button
          ui="primary"
          @click="contentAutoHeightDialogVisible = false"
        >
          OK
        </veui-button>
        <veui-button
          autofocus
          @click="contentAutoHeightDialogVisible = false"
        >
          CANCEL
        </veui-button>
      </template>
    </veui-dialog>
    <veui-button
      ui="primary"
      @click="contentAutoHeightDialogVisible = true"
    >
      Adaptive Content Height
    </veui-button>
  </section>

  <section>
    <veui-button
      @click="popupAlert('info', 'You\'ve got a new message', 'Message')"
    >
      Info Box
    </veui-button>
    <veui-button
      @click="popupAlert('error', 'You\'ve got an error', 'Error')"
    >
      Error Box
    </veui-button>
    <veui-button
      @click="
        popupAlert('success', 'Congratulations! Everything is ok!', 'Success')
      "
    >
      Success Box
    </veui-button>
    <veui-button
      ui="primary"
      @click="popupAlerts"
    >
      Open a stack of AlertBox
    </veui-button>
  </section>

  <section>
    <veui-button @click="alertOpen = true">
      Inline AlertBox
    </veui-button>
    <veui-button @click="confirmOpen = true">
      Inline ConfirmBox
    </veui-button>
    <veui-button @click="promptOpen = true">
      Inline PromptBox
    </veui-button>
    <veui-alert-box
      ui="s"
      :open.sync="alertOpen"
    >
      Hello world.
    </veui-alert-box>
    <veui-confirm-box
      ui="s"
      :open.sync="confirmOpen"
    >
      Hello world.
    </veui-confirm-box>
    <veui-prompt-box
      :open.sync="promptOpen"
      @ok="$alert($event, 'Result')"
    />
  </section>

  <section>
    <veui-button
      ui="primary"
      @click="popupConfirms"
    >
      Open ConfirmBox
    </veui-button>
  </section>
  <section>
    <veui-button @click="popupToasts('info')">
      Info Toast
    </veui-button>
    <veui-button @click="popupToasts('warn')">
      Warn Toast
    </veui-button>
    <veui-button @click="popupToasts('error')">
      Error Toast
    </veui-button>
    <veui-button @click="popupToasts('success')">
      Success Toast
    </veui-button>
    <veui-button
      ui="primary"
      @click="popupToasts"
    >
      Open Toasts
    </veui-button>
  </section>
  <section>
    <veui-button
      ref="p"
      ui="primary"
      @click="popupPrompt"
    >
      Open Prompt
    </veui-button>
  </section>
</article>
</template>
<script>
import { Dialog, AlertBox, ConfirmBox, PromptBox, Button, Icon } from 'veui'
import alertManager from 'veui/managers/alert'
import confirmManager from 'veui/managers/confirm'
import promptManager from 'veui/managers/prompt'
import toastManager from 'veui/managers/toast'
import alert from 'veui/plugins/alert'
import confirm from 'veui/plugins/confirm'
import prompt from 'veui/plugins/prompt'
import toast from 'veui/plugins/toast'
import Vue from 'vue'
import 'veui-theme-dls-icons/calendar'

Vue.use(alert)
Vue.use(confirm)
Vue.use(prompt)
Vue.use(toast)

export default {
  name: 'dialog-demo',
  components: {
    'veui-dialog': Dialog,
    'veui-alert-box': AlertBox,
    'veui-confirm-box': ConfirmBox,
    'veui-prompt-box': PromptBox,
    'veui-button': Button,
    'veui-icon': Icon
  },
  data () {
    return {
      modalDialogVisible: false,
      fullscreenDialogVisible: false,
      autoDialogVisible: false,
      titlelessDialogVisible: false,
      nonModalDialogVisible: false,
      draggableDialog1Visible: false,
      draggableDialog2Visible: false,
      draggableDialog3Visible: false,
      operationDialogVisible: false,
      customTextTitleDialogVisible: false,
      customIconTitleDialogVisible: false,
      contentAutoHeightDialogVisible: false,
      alertOpen: false,
      confirmOpen: false,
      promptOpen: false,
      dynamicContent: '',
      test: '123',
      adaptiveDialogTimer: null,
      loading: false,
      beforeClose: type => {
        if (type === 'cancel') {
          return
        }

        this.loading = true
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
            this.loading = false
          }, 2000)
        })
      }
    }
  },
  watch: {
    contentAutoHeightDialogVisible (value) {
      if (value) {
        this.adaptiveDialogTimer = setInterval(() => {
          this.dynamicContent += `${Date.now()}<br>`
        }, 1000)
      } else {
        clearTimeout(this.adaptiveDialogTimer)
        this.dynamicContent = ''
      }
    },
    draggableDialog3Visible (value) {
      if (!value) {
        this.$refs.resetDialog.resetPosition()
      }
    }
  },
  methods: {
    popupAlert (type, content, title) {
      alertManager[type](content, title)
    },
    handleOk () {
      this.$toast('The `OK` button was clicked!')
    },
    handleCancel () {
      this.$alert('The `cancel` button was clicked!')
    },
    popupAlerts () {
      alertManager.success('The task was successfully completed!', 'Success', {
        ok: () => {
          this.$alert('This alert box will be closed after 3 seconds.')
          return new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, 3000)
          })
        }
      })
      alertManager.info('The task has been completed thirty percent.', 'Info')
      alertManager.error('Something went wrong!', 'Error')
      alertManager.warn('The name is invalid.', 'Warn')
    },
    popupConfirms () {
      confirmManager
        .warn('Do you really want to delete it?', 'Confirm', {
          ok: async () => {
            await wait(1000)

            if (Math.random() < 0.5) {
              this.$toast.error('Not lucky enough :(')
              return false
            }
          }
        })
        .then(ok => {
          this.$alert(`You chose [${ok ? 'ok' : 'cancel'}]`)
        })
    },
    popupToasts (type) {
      if (type && toastManager[type]) {
        toastManager[type](`${type} message`)
      } else {
        let index = 0
        let timer = setInterval(() => {
          const type = ['warn', 'error', 'info', 'success'][index]
          toastManager[type](`${type}-${index + 1}`)

          if (++index > 3) {
            clearTimeout(timer)
          }
        }, 1000)
      }
    },
    popupPrompt () {
      promptManager
        .info('Please tell us your age:', 'Prompt', {
          ok: async val => {
            await wait(1000)
            let num = Number(val)
            if (`${num}` !== val || num <= 0) {
              this.$toast.error('Please enter a valid age.')
              return false
            }
          }
        })
        .then(value => {
          console.log(value)
        })
    }
  }
}

function wait (timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 10px;
}

.demo-dialog {
  .veui-button {
    margin-right: 10px;
  }

  &-standard-dialog .veui-dialog-content {
    width: 540px;

    &-body {
      border: 1px dashed #999;
      height: 280px;

      p {
        color: #999;
        text-align: center;
        margin: 0;
      }
    }
  }
}

.auto-dialog-standard-dialog {
  .veui-dialog-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100px;
  }

  .resizable {
    resize: both;
  }
}
</style>
