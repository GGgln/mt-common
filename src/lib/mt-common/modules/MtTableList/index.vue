<template>
  <a-table :columns="form.columns" :dataSource="form.data" bordered>
    <template slot="operation" slot-scope="test, record">
      <a-button v-for="(el, index) in form.formButtons">{{ el.name }}</a-button>
    </template>
    <slot name="mtTableOperationBtn" :row="record"></slot>
  </a-table>
</template>
<script>
export default {
  name: 'mt-table-list',
  props: ['form'],
  data() {
    return {

    }
  }
}
</script>