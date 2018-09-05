<template>
  <article>
    <h1><code>&lt;veui-grid-*&gt;</code></h1>
    <section>
      <h3>Default Grid</h3>
      <figure>
        <veui-grid-container>
          <veui-grid-row>
            <veui-grid-column :span="8"><div class="content">1/3</div></veui-grid-column>
            <veui-grid-column :span="16"><div class="content">2/3</div></veui-grid-column>
          </veui-grid-row>
          <veui-grid-row>
            <veui-grid-column :span="6"><div class="content">1/4</div></veui-grid-column>
            <veui-grid-column :span="6"><div class="content">1/4</div></veui-grid-column>
            <veui-grid-column :span="6"><div class="content">1/4</div></veui-grid-column>
            <veui-grid-column :span="6"><div class="content">1/4</div></veui-grid-column>
          </veui-grid-row>
          <veui-grid-row>
            <veui-grid-column :span="12"><div class="content">1/2</div></veui-grid-column>
            <veui-grid-column :span="6"><div class="content">1/4</div></veui-grid-column>
            <veui-grid-column :span="4"><div class="content">1/6</div></veui-grid-column>
            <veui-grid-column :span="2"><div class="content">1/12</div></veui-grid-column>
          </veui-grid-row>
        </veui-grid-container>
      </figure>
    </section>

    <section>
      <h3>4 Columns</h3>
      <figure>
        <veui-grid-container :columns="4">
          <veui-grid-row>
            <veui-grid-column :span="1"><div class="content">1/4</div></veui-grid-column>
            <veui-grid-column :span="1"><div class="content">1/4</div></veui-grid-column>
            <veui-grid-column :span="1"><div class="content">1/4</div></veui-grid-column>
            <veui-grid-column :span="1"><div class="content">1/4</div></veui-grid-column>
          </veui-grid-row>
        </veui-grid-container>
      </figure>
    </section>

    <section>
      <h3>12 Columns + 15px Gutter Embedded Grid + Flex <small>(equal height columns)</small></h3>
      <figure class="flex">
        <veui-grid-container flex :columns="12" :gutter="15">
          <veui-grid-row>
            <veui-grid-column :span="8">
              <veui-grid-row>
                <veui-grid-column :span="4"><div class="content">4/12</div></veui-grid-column>
                <veui-grid-column :span="4"><div class="content">4/12</div></veui-grid-column>
              </veui-grid-row>
              <veui-grid-row>
                <veui-grid-column :span="3"><div class="content">3/12</div></veui-grid-column>
                <veui-grid-column :span="5"><div class="content">5/12</div></veui-grid-column>
              </veui-grid-row>
            </veui-grid-column>
            <veui-grid-column :span="4"><div class="content">4/12</div></veui-grid-column>
          </veui-grid-row>
        </veui-grid-container>
      </figure>
    </section>

    <section>
      <h3>Offset, push & pull</h3>
      <figure>
        <veui-grid-container>
          <veui-grid-row>
            <veui-grid-column :span="8" :offset="8"><div class="content">8/24 (offset: 8)</div></veui-grid-column>
            <veui-grid-column :span="8"><div class="content">8/24</div></veui-grid-column>
          </veui-grid-row>
          <veui-grid-row>
            <veui-grid-column :span="8" :push="16"><div class="content">8/24 (push: 16)</div></veui-grid-column>
            <veui-grid-column :span="16" :pull="8"><div class="content">16/24 (pull: 8)</div></veui-grid-column>
          </veui-grid-row>
        </veui-grid-container>
      </figure>
    </section>
  </article>
</template>

<script>
import { GridContainer, GridRow, GridColumn } from 'veui'

export default {
  name: 'grid',
  components: {
    'veui-grid-container': GridContainer,
    'veui-grid-row': GridRow,
    'veui-grid-column': GridColumn
  }
}
</script>

<style lang="less" scoped>
section {
  margin: 30px;
}

figure {
  overflow: hidden;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 0;

  &.flex {
    padding: 10px 0;
  }
}

.content {
  background-color: #eee;
  height: 100%;
  line-height: 60px;
  border-radius: 2px;
}

.side {
  height: 100%;
}

.veui-grid-row {
  text-align: center;

  & + & {
    margin-top: 30px;

    .flex & {
      margin-top: 10px;
    }
  }
}
</style>
