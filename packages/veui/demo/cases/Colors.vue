<template>
<article>
  <figure
    v-for="serie in series"
    :key="serie"
    :class="['serie', `serie-${serie}`]"
  >
    <div
      v-for="i in 10"
      :key="i"
      class="shade"
    />
  </figure>
</article>
</template>

<script>
export default {
  name: 'color-palette-demo',
  data () {
    return {
      series: ['brand', 'info', 'success', 'warning', 'error']
    }
  }
}
</script>

<style lang="less" scoped>
@import "~veui-theme-dls/lib.less";

article {
  padding-top: 120px;
}

figure {
  float: left;
  margin-right: 10px;
}

.serie {
  display: flex;
  flex-flow: column;
  width: 100px;
}

.shade {
  height: 24px;
  margin-bottom: 4px;
  border-radius: 3px;
}

.generate-colors(@type, @n, @i: 1) when (@i =< @n) {
  .serie-@{type} .shade:nth-child(@{i}) {
    @var: ~'dls-color-@{type}-@{i}';
    background-color: @@var;
  }
  .generate-colors(@type, @n, (@i + 1));
}

.generate-colors(brand, 10);
.generate-colors(info, 10);
.generate-colors(success, 10);
.generate-colors(warning, 10);
.generate-colors(error, 10);
</style>
