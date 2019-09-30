<template>
  <a-table :columns="form.columns" :dataSource="data" bordered>
    <template slot="operation" slot-scope="test, record">
      
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