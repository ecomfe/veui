<template>
<article>
  <h1>
    <code>&lt;veui-icon&gt;</code>
  </h1>
  <section>
    <veui-checkbox v-model="compact">Compact</veui-checkbox>
    <veui-radio-button-group v-model="color" :items="colors"/>
  </section>
  <div class="icons" :class="{ compact }">
    <div v-for="icon in icons" :key="icon" class="icon">
      <div v-tooltip="{ content: icon, disabled: !compact }" class="svg">
        <veui-icon :name="icon" :class="color"/>
      </div>
      <transition name="name">
        <div v-if="!compact" class="name">{{ icon }}</div>
      </transition>
    </div>
  </div>
</article>
</template>

<script>
import bus from '../bus'
import { Icon } from 'veui'
import 'veui-theme-dls-icons'
import Checkbox from '@/components/Checkbox'
import RadioButtonGroup from '@/components/RadioButtonGroup'
import tooltip from '@/directives/tooltip'
import icons from 'veui-theme-dls-icons/icon-names.json'

export default {
  name: 'icon-demo',
  directives: {
    tooltip
  },
  components: {
    'veui-checkbox': Checkbox,
    'veui-icon': Icon,
    'veui-radio-button-group': RadioButtonGroup
  },
  data () {
    return {
      icons,
      compact: false,
      colors: [
        { label: 'Normal', value: 'normal' },
        { label: 'Strong', value: 'strong' },
        { label: 'Light', value: 'light' },
        { label: 'Weak', value: 'weak' },
        { label: 'Dim', value: 'dim' },
        { label: 'Primary', value: 'primary' }
      ],
      color: 'normal'
    }
  },
  mounted () {
    this.$children.forEach((child) => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import "~veui-theme-dls/lib.less";

section {
  display: flex;
  gap: 16px;
  align-items: center;
}

.icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.icons,
.icon,
.svg,
.name-enter-active,
.name-leave-active {
  transition: all 0.3s;
}

.name-leave-active {
  transition-duration: 0.1s;
}

.icon {
  @grid-size: 100px;

  position: relative;
  width: @grid-size;
  height: @grid-size + (0.8 + 0.6) * 16px;
  text-align: center;
  margin: 2em;

  .svg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: @grid-size;
    height: @grid-size;
    border: 1px solid transparent;
    font-size: 36px;
    border-radius: 4px;

    &:hover {
      border-color: #ccc;
    }
  }

  .name {
    position: absolute;
    left: 50px;
    transform: translateX(-50%);
    white-space: nowrap;
    margin-top: 0.6em;
    color: #333;
    font-size: 12px;
  }
}

.normal {
  color: @dls-foreground-color-neutral;
}

.strong {
  color: @dls-foreground-color-neutral-strong;
}

.light {
  color: @dls-foreground-color-neutral-light;
}

.weak {
  color: @dls-foreground-color-neutral-weak;
}

.dim {
  color: @dls-foreground-color-neutral-dim;
}

.primary {
  color: @dls-foreground-color-primary;
}

.compact {
  @grid-size-compact: 32px;

  &.icons {
    padding-top: 32px;
  }

  .icon {
    margin: 4px;
  }

  .icon,
  .svg {
    width: @grid-size-compact;
    height: @grid-size-compact;
    font-size: 24px;
    border-radius: 2px;
  }
}

.name-enter,
.name-leave-to {
  opacity: 0;
}

.name-enter-to,
.name-leave {
  opacity: 1;
}
</style>
