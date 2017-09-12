<template>
  <article class="demo-dialog">
    <h1><code>&lt;veui-dialog&gt;</code></h1>
    <p>
      <veui-dialog :modal="true"
        overlay-class="test demo-dialog-standard-dialog"
        :open="modalDialogVisible"
        title="Dialog Title"
        @update:open="(value) => modalDialogVisible = value">
        <p>content area</p>
        <template slot="foot">
          <veui-button ui="primary" @click="modalDialogVisible = false">OK</veui-button>
          <veui-button @click="modalDialogVisible = false">CANCEL</veui-button>
        </template>
      </veui-dialog>
      <veui-button ui="primary"
        @click="modalDialogVisible = !modalDialogVisible">Open a model dialog box</veui-button>

      <veui-dialog :modal="false"
        :open="nonModalDialogVisible"
        title="Dialog Title"
        @update:open="(value) => nonModalDialogVisible = value">
        The content of the Dialog. You can use the default slot to override it.
        <template slot="foot">
          <veui-button ui="primary" @click="nonModalDialogVisible = false">OK</veui-button>
          <veui-button @click="nonModalDialogVisible = false">CANCEL</veui-button>
        </template>
      </veui-dialog>
      <veui-button ui="primary"
        @click="nonModalDialogVisible = !nonModalDialogVisible">Open a modeless dialog box</veui-button>
    </p>
    <p>
      <veui-dialog :draggable="true"
        :modal="false"
        :open.sync="draggableDialog1Visible"
        ui="center"
        title="First">
        You can drag the dialog box in the viewport.
        <template slot="foot">
          <veui-button ui="primary" @click="draggableDialog1Visible = false">OK</veui-button>
          <veui-button @click="draggableDialog1Visible = false">CANCEL</veui-button>
        </template>
      </veui-dialog>
      <veui-button ui="primary" @click="draggableDialog1Visible = !draggableDialog1Visible">Open the first draggable dialog box</veui-button>

      <veui-dialog :draggable="true"
        :modal="false"
        :open="draggableDialog2Visible"
        title="Second"
        @update:open="(value) => draggableDialog2Visible = value"
        ui="reverse top">
        <p>Drag the current dialog box to the right and open the first draggable dialog.</p>
        <p>Keep the two dialog have some parts overlapped.</p>
        <p>You'll see the first draggable dialog is higher than the second one.</p>
        <p>You can bring the second dialog to the top layer by clicking the second dialog.</p>
        <template slot="foot">
          <veui-button ui="primary" @click="draggableDialog2Visible = false">OK</veui-button>
          <veui-button @click="draggableDialog2Visible = false">CANCEL</veui-button>
        </template>
      </veui-dialog>
      <veui-button ui="primary" @click="draggableDialog2Visible = !draggableDialog2Visible">Open the second draggable dialog box</veui-button>

      <veui-dialog :draggable="true"
        :modal="false"
        :open="draggableDialog3Visible"
        title="Reset Position"
        @update:open="(value) => ($refs.resetDialog.resetPosition(), draggableDialog3Visible = value)"
        ui="reverse top"
        ref="resetDialog">
        Click the `reset` button to put the dialog to the initial position.
        <template slot="foot">
          <veui-button @click="() => $refs.resetDialog.resetPosition()" ui="alt">Reset</veui-button>
        </template>
      </veui-dialog>
      <veui-button ui="alt" @click="draggableDialog3Visible = !draggableDialog3Visible">Draggable dialog box with reset button</veui-button>
    </p>
    <p>
      <veui-dialog :open="operationDialogVisible"
        @update:open="(value) => operationDialogVisible = value"
        @ok="handleOk"
        @cancel="handleCancel"
        title="The Built-in Button">
        The two built-in buttons emit their own event when clicked.
      </veui-dialog>
      <veui-button ui="primary" @click="operationDialogVisible = true">The Built-in Button</veui-button>
    </p>
    <p>
      <veui-dialog :open="customTextTitleDialogVisible"
        @update:open="(value) => customTextTitleDialogVisible = value"
        title="Custom Title">
        You can change the dialog title text by setting the `title` prop or passing in the `title` slot parameter.
        <template slot="foot">
          <veui-button ui="primary" @click="customTextTitleDialogVisible = false">OK</veui-button>
          <veui-button @click="customTextTitleDialogVisible = false">CANCEL</veui-button>
        </template>
      </veui-dialog>
      <veui-button ui="primary" @click="customTextTitleDialogVisible = true">Custom Title</veui-button>

      <veui-dialog :open="customIconTitleDialogVisible"
        @update:open="(value) => customIconTitleDialogVisible = value">
        <template slot="title">Custom Title With ICON <icon class="svg" name="calendar"></icon></template>
        <template slot="foot">
          <veui-button ui="primary" @click="customIconTitleDialogVisible = false">OK</veui-button>
          <veui-button @click="customIconTitleDialogVisible = false">CANCEL</veui-button>
        </template>
        You can add icons to title by the `title slot`.
      </veui-dialog>
      <veui-button ui="primary" @click="customIconTitleDialogVisible = true">Custom Title With ICON</veui-button>
    </p>

    <p>
      <veui-dialog :open="contentAutoHeightDialogVisible"
        @update:open="(value) => contentAutoHeightDialogVisible = value"
        title="Adaptive Content Height">
        <p>The following increaming content string will incream the content height slowly:</p>
        <div v-html="dynamicContent"></div>
        <template slot="foot">
          <veui-button ui="primary" @click="contentAutoHeightDialogVisible = false">OK</veui-button>
          <veui-button @click="contentAutoHeightDialogVisible = false">CANCEL</veui-button>
        </template>
      </veui-dialog>
      <veui-button ui="primary" @click="contentAutoHeightDialogVisible = true">Adaptive Content Height</veui-button>
    </p>

    <p>
      <veui-button @click="popupAlert('info', 'you\'ve got a new message', 'Message')">Info Box</veui-button>
      <veui-button @click="popupAlert('error', 'you\'ve got an error', 'Error')">Error Box</veui-button>
      <veui-button @click="popupAlert('success', 'Congratulations! Everything is ok!', 'Success')">Success Box</veui-button>
      <veui-button ui="primary" @click="popupAlerts">Open a stack of AlertBox</veui-button>
    </p>
    <p>
      <veui-button ui="primary" @click="popupConfirms">Open ConfirmBox</veui-button>
    </p>
    <p>
      <veui-button ui="primary" @click="popupToasts">Open Toasts</veui-button>
    </p>
    <p>
      <veui-button ui="primary" @click="popupPrompt">Open Prompt</veui-button>
    </p>
  </article>
</template>
<script>
import { Dialog, Button, Icon } from 'veui'
import alertManager from 'veui/managers/alert'
import confirmManager from 'veui/managers/confirm'
import promptManager from 'veui/managers/prompt'
import toastManager from 'veui/managers/toast'
import 'veui-theme-x/icons/calendar'

export default {
  name: 'dialog-demo',
  components: {
    Icon,
    'veui-dialog': Dialog,
    'veui-button': Button
  },
  data () {
    return {
      modalDialogVisible: false,
      nonModalDialogVisible: false,
      draggableDialog1Visible: false,
      draggableDialog2Visible: false,
      draggableDialog3Visible: false,
      operationDialogVisible: false,
      customTextTitleDialogVisible: false,
      customIconTitleDialogVisible: false,
      contentAutoHeightDialogVisible: false,
      dynamicContent: '',
      test: '123'
    }
  },
  created () {
    setInterval(() => {
      this.dynamicContent += `${Date.now()}<br>`
    }, 1000)
  },
  watch: {
    contentAutoHeightDialogVisible (value) {
      if (value) {
        this.dynamicContent = ''
      }
    }
  },
  methods: {
    popupAlert (type, content, title) {
      alertManager[type](content, title)
    },
    handleOk () {
      alert('The `OK` button was clicked!')
    },
    handleCancel () {
      alert('The `cancel` button was clicked!')
    },
    popupAlerts () {
      alertManager.success('The task was successfully completed!', 'Success', {
        ok () {
          alert('This alert box will be closed after 3 seconds.')
          return new Promise(resolve => {
            setTimeout(resolve, 3000)
          })
        }
      })
      alertManager.info('The task has been completed thirty percent.', 'Info')
      alertManager.error('Something went wrong!', 'Error')
      alertManager.warn('The name is invalid.', 'Warn')
    },
    popupConfirms () {
      confirmManager.warn('Do you really want to delete it?', 'Confirm', {
        ok () {
          alert('Prevent default close')
          return true
        }
      })
        .then(isOk => {
          if (isOk) {
            alert('Choose `yes`')
          }
        })
    },
    popupToasts () {
      let counter = 1
      setInterval(() => {
        counter++
        const type = ['error', 'info', 'success'][counter % 3]
        toastManager[type](`${type}-${counter}`)
      }, 1000)
    },
    popupPrompt () {
      promptManager.info('Please tell us your age:', 'Prompt').then(({ isOk, value }) => {
        if (isOk) {
          alert(value)
        }
      })
    }
  }
}
</script>

<style lang="less">
.demo-dialog {
  .svg {
    width: 20px;
  }
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
        margin-top: 120px;
      }
    }
  }
}
</style>
